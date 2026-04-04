// components/reports/PreviousReportsDropdown.tsx
import React, { useState } from "react";
import { useTestReportData } from "../../hooks/useTestReport";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Eye,
  User,
  Calendar,
  Activity,
  Clock,
  Flag,
  Search,
} from "lucide-react";
import { format } from "date-fns";

interface PreviousReportsDropdownProps {
  onSelectReport?: (reportId: string) => void;
}

const PreviousReportsDropdown: React.FC<PreviousReportsDropdownProps> = ({
  onSelectReport,
}) => {
  const { reports, loading, getStatusColor, getPriorityColor } =
    useTestReportData();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReports = reports.filter(
    (report) =>
      report.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.disease.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy, hh:mm a");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div
        className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <FileText className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Previous Reports
            </h2>
            <p className="text-sm text-gray-600">
              View and manage existing test reports ({reports.length} total)
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </div>

      {/* Content */}
      {isOpen && (
        <div className="p-6 border-t border-gray-100">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name, report ID, or disease..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Reports List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No reports found</p>
              {searchTerm && (
                <p className="text-sm text-gray-400 mt-1">
                  Try a different search term
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredReports.map((report) => (
                <div
                  key={report._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onSelectReport?.(report.reportId)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {report.reportId}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            report.status,
                          )}`}
                        >
                          {report.status.toUpperCase()}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            report.priority,
                          )}`}
                        >
                          <Flag className="h-3 w-3 inline mr-1" />
                          {report.priority.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-2 text-purple-500" />
                          <span className="font-medium">
                            {report.patient.name}
                          </span>
                          <span className="mx-2">•</span>
                          <span className="text-gray-500">
                            {report.patient.email}
                          </span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <Activity className="h-4 w-4 mr-2 text-purple-500" />
                          <span>{report.disease}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(report.createdAt)}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{report.tests.length} test(s) requested</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {report.reportDescription}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectReport?.(report.reportId);
                      }}
                      className="ml-4 p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PreviousReportsDropdown;
