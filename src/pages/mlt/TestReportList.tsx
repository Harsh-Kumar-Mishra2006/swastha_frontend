// pages/mlt/ViewReportList.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import testReportService from "../../services/testReportService";
import { type TestReport } from "../../types/testReport";
import {
  FileText,
  Search,
  Filter,
  Calendar,
  User,
  Stethoscope,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

const ViewReportList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<TestReport[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  });

  // Filters
  const [filters, setFilters] = useState({
    category: "",
    startDate: "",
    endDate: "",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (user?.id) {
      loadReports();
    }
  }, [user, currentPage, filters]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await testReportService.getCompletedReports(user!.id, {
        ...filters,
        page: currentPage,
        limit: 20,
      });

      if (response.success) {
        setReports(response.data.reports);
        setSummary(response.data.summary);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error("Failed to load reports");
      console.error("Error loading reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      startDate: "",
      endDate: "",
      search: "",
    });
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      assigned: { color: "bg-blue-100 text-blue-800", icon: Clock },
      "in-progress": { color: "bg-purple-100 text-purple-800", icon: Clock },
      completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      cancelled: { color: "bg-red-100 text-red-800", icon: XCircle },
    };
    const config = configs[status as keyof typeof configs] || configs.pending;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const configs = {
      emergency: { color: "bg-red-100 text-red-800", label: "🚨 Emergency" },
      urgent: { color: "bg-orange-100 text-orange-800", label: "⚡ Urgent" },
      routine: { color: "bg-green-100 text-green-800", label: "📋 Routine" },
    };
    const config = configs[priority as keyof typeof configs] || configs.routine;
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FileText className="h-8 w-8 text-teal-600 mr-3" />
              My Reports
            </h1>
            <p className="text-gray-600 mt-1">
              View all your completed test reports
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button
              onClick={loadReports}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 flex items-center border border-gray-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={() => navigate("/mlt/dashboard")}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center"
            >
              <Clock className="h-4 w-4 mr-2" />
              Assigned Tests
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="text-2xl font-bold text-teal-600">
                {summary.totalReports || 0}
              </div>
              <div className="text-sm text-gray-500">Total Reports</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {reports.filter((r) => r.status === "completed").length}
              </div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {reports.filter((r) => r.test_priority === "emergency").length}
              </div>
              <div className="text-sm text-gray-500">Emergency</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {summary.avgTime
                  ? Math.round(summary.avgTime / (1000 * 60 * 60))
                  : 0}
                h
              </div>
              <div className="text-sm text-gray-500">Avg. Completion Time</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Search className="h-4 w-4 inline mr-1" />
                Search
              </label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Patient, doctor, test..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Filter className="h-4 w-4 inline mr-1" />
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">All Categories</option>
                <option value="Hematology">Hematology</option>
                <option value="Microbiology">Microbiology</option>
                <option value="Biochemistry">Biochemistry</option>
                <option value="Pathology">Pathology</option>
                <option value="Radiology">Radiology</option>
                <option value="Immunology">Immunology</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="h-4 w-4 inline mr-1" />
                From Date
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="h-4 w-4 inline mr-1" />
                To Date
              </label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reports List */}
        {reports.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Reports Found
            </h3>
            <p className="text-gray-500">
              {filters.search ||
              filters.category ||
              filters.startDate ||
              filters.endDate
                ? "Try adjusting your filters"
                : "You haven't completed any reports yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {reports.map((report) => (
              <div
                key={report._id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {report.test_name}
                      </h3>
                      {getPriorityBadge(report.test_priority)}
                      {getStatusBadge(report.status)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-1" />
                        <span className="truncate">{report.patient_name}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Stethoscope className="h-4 w-4 mr-1" />
                        <span className="truncate">{report.doctor_name}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FileText className="h-4 w-4 mr-1" />
                        <span>{report.test_category}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {report.completed_date
                            ? formatDate(report.completed_date)
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    {report.results_summary && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {report.results_summary}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <button
                      onClick={() => navigate(`/reports/view/${report._id}`)}
                      className="px-3 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 flex items-center text-sm"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                    {report.test_report_url && (
                      <a
                        href={report.test_report_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 flex items-center text-sm"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </a>
                    )}
                  </div>
                </div>

                {/* Report Version Info */}
                {report.report_version && report.report_version > 1 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                    Version {report.report_version} • Updated:{" "}
                    {new Date(report.updatedAt).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 bg-white rounded-xl shadow-lg px-4 py-3">
            <div className="text-sm text-gray-500">
              Showing{" "}
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.itemsPerPage,
                pagination.totalItems,
              )}{" "}
              of {pagination.totalItems} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 py-1 bg-teal-600 text-white rounded-lg">
                {currentPage}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, pagination.totalPages),
                  )
                }
                disabled={currentPage === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewReportList;
