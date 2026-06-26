// pages/common/TestReportsList.tsx
import { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  User,
  Stethoscope,
  Microscope,
  Calendar,
  Download,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import testReportService from "../../services/testReportService";
import { type TestReport } from "../../types/testReport";
import { useNavigate } from "react-router-dom";

const TestReportsList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<TestReport[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<TestReport | null>(null);

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await testReportService.getPublicTestReports(
        filter,
        undefined,
        searchTerm || undefined,
      );

      if (response.success) {
        setReports(response.data);
        setStats(response.statistics);
        if (response.data.length > 0 && !selectedReport) {
          setSelectedReport(response.data[0]);
        }
      }
    } catch (error) {
      console.error("❌ Error fetching reports:", error);
      toast.error("Failed to load test reports");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchReports();
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { color: string; icon: any; label: string }> =
      {
        pending: {
          color: "bg-yellow-100 text-yellow-800",
          icon: Clock,
          label: "Pending",
        },
        assigned: {
          color: "bg-blue-100 text-blue-800",
          icon: User,
          label: "Assigned",
        },
        "in-progress": {
          color: "bg-purple-100 text-purple-800",
          icon: Loader,
          label: "In Progress",
        },
        completed: {
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
          label: "Completed",
        },
        cancelled: {
          color: "bg-red-100 text-red-800",
          icon: XCircle,
          label: "Cancelled",
        },
      };
    const config = configs[status] || configs.pending;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        <Icon className="h-4 w-4 mr-1" />
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const configs: Record<string, { color: string; label: string }> = {
      routine: { color: "bg-gray-100 text-gray-800", label: "Routine" },
      urgent: { color: "bg-orange-100 text-orange-800", label: "Urgent" },
      emergency: { color: "bg-red-100 text-red-800", label: "Emergency" },
    };
    const config = configs[priority] || configs.routine;
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FileText className="h-8 w-8 mr-3 text-teal-600" />
              Test Reports
            </h1>
            <p className="text-gray-600 mt-1">
              View all test reports from doctors and MLTs
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            {[
              {
                label: "Total",
                value: stats.total,
                color: "bg-blue-50 text-blue-600",
              },
              {
                label: "Pending",
                value: stats.pending,
                color: "bg-yellow-50 text-yellow-600",
              },
              {
                label: "Assigned",
                value: stats.assigned,
                color: "bg-purple-50 text-purple-600",
              },
              {
                label: "In Progress",
                value: stats["in-progress"],
                color: "bg-indigo-50 text-indigo-600",
              },
              {
                label: "Completed",
                value: stats.completed,
                color: "bg-green-50 text-green-600",
              },
              {
                label: "Cancelled",
                value: stats.cancelled,
                color: "bg-red-50 text-red-600",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className={`${stat.color} rounded-xl p-4 text-center transition-transform hover:scale-105`}
              >
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                "all",
                "pending",
                "assigned",
                "in-progress",
                "completed",
                "cancelled",
              ].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by patient, doctor, test..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 w-64"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {reports.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No test reports found</p>
              </div>
            ) : (
              reports.map((report) => (
                <button
                  key={report._id}
                  onClick={() => setSelectedReport(report)}
                  className={`w-full text-left bg-white rounded-xl p-4 shadow-sm transition-all hover:shadow-md ${
                    selectedReport?._id === report._id
                      ? "ring-2 ring-teal-500 border-transparent"
                      : "border border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-gray-900 truncate">
                          {report.test_name}
                        </p>
                        {getPriorityBadge(report.test_priority)}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        Patient: {report.patient_name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        Doctor: {report.doctor_name}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="ml-2">{getStatusBadge(report.status)}</div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-2">
            {selectedReport ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6 pb-4 border-b">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedReport.test_name}
                      </h2>
                      {getPriorityBadge(selectedReport.test_priority)}
                      {getStatusBadge(selectedReport.status)}
                    </div>
                    <p className="text-gray-600 mt-1">
                      {selectedReport.test_category}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/test-reports/${selectedReport._id}`)
                    }
                    className="px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center space-x-2 text-sm"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Full Details</span>
                  </button>
                </div>

                {/* Doctor Info */}
                <div className="bg-teal-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <Stethoscope className="h-4 w-4 mr-2 text-teal-600" />
                    Doctor Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="font-medium">
                        {selectedReport.doctor_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium">
                        {selectedReport.doctor_email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Specialization</p>
                      <p className="font-medium">
                        {selectedReport.doctor_specialization}
                      </p>
                    </div>
                  </div>
                </div>

                {/* MLT Info */}
                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <Microscope className="h-4 w-4 mr-2 text-purple-600" />
                    MLT Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="font-medium">{selectedReport.mlt_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium">{selectedReport.mlt_email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Specialization</p>
                      <p className="font-medium">
                        {selectedReport.mlt_specialization}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Patient Info */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2 text-blue-600" />
                    Patient Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="font-medium">
                        {selectedReport.patient_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium">
                        {selectedReport.patient_email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="font-medium">
                        {selectedReport.patient_phone || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Age/Gender</p>
                      <p className="font-medium">
                        {selectedReport.patient_age || "N/A"} /{" "}
                        {selectedReport.patient_gender || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Test Results (if completed) */}
                {selectedReport.status === "completed" && (
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2">
                      Test Results
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-500">Results</p>
                        <p className="font-medium">
                          {selectedReport.test_results || "No results provided"}
                        </p>
                      </div>
                      {selectedReport.results_summary && (
                        <div>
                          <p className="text-gray-500">Summary</p>
                          <p className="font-medium">
                            {selectedReport.results_summary}
                          </p>
                        </div>
                      )}
                      {selectedReport.test_conclusion && (
                        <div>
                          <p className="text-gray-500">Conclusion</p>
                          <p className="font-medium">
                            {selectedReport.test_conclusion}
                          </p>
                        </div>
                      )}
                      {selectedReport.test_report_url && (
                        <a
                          href={selectedReport.test_report_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-teal-600 hover:text-teal-700"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download Report
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Cancelled Reason */}
                {selectedReport.status === "cancelled" && (
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <p className="text-red-700 font-medium">Test Cancelled</p>
                    <p className="text-red-600 text-sm">
                      {selectedReport.mlt_notes || "No reason provided"}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Select a test report to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestReportsList;
