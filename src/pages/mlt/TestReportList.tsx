// pages/mlt/TestReportsList.tsx
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
  ChevronDown,
  ChevronUp,
  Pill,
  Heart,
  Activity,
  AlertCircle,
  Calendar as CalendarIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import testReportService from "../../services/testReportService";
import { type TestReport } from "../../types/testReport";

const TestReportsList = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<TestReport[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [_selectedReport, _setSelectedReport] = useState<TestReport | null>(
    null,
  );
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // Fix: Pass the filter and search correctly
      const response = await testReportService.getPublicTestReports(
        filter === "all" ? undefined : filter,
        undefined,
        searchTerm || undefined,
      );

      if (response.success) {
        setReports(response.data);
        setStats(response.statistics);
        // Don't auto-select first report
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

  const toggleExpand = (reportId: string) => {
    setExpandedReport(expandedReport === reportId ? null : reportId);
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

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

        {/* Reports Grid - Full Width with Expandable Cards */}
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No test reports found</p>
            </div>
          ) : (
            reports.map((report) => {
              const isExpanded = expandedReport === report._id;
              return (
                <div
                  key={report._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300"
                >
                  {/* Card Header - Always Visible */}
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleExpand(report._id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {report.test_name}
                          </h3>
                          {getPriorityBadge(report.test_priority)}
                          {getStatusBadge(report.status)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <User className="h-4 w-4 mr-2 text-blue-500" />
                            <span>Patient: {report.patient_name}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Stethoscope className="h-4 w-4 mr-2 text-teal-500" />
                            <span>Doctor: {report.doctor_name}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Microscope className="h-4 w-4 mr-2 text-purple-500" />
                            <span>MLT: {report.mlt_name}</span>
                          </div>
                        </div>
                        <div className="flex items-center mt-2 text-xs text-gray-400">
                          <Calendar className="h-3 w-3 mr-1" />
                          Created: {formatDate(report.createdAt)}
                          {report.completed_date && (
                            <>
                              <span className="mx-2">•</span>
                              <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                              Completed: {formatDate(report.completed_date)}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-2xl hover:scale-105 hover:bg-gradient-to-r hover:brightness-125 rounded-lg">
                          View Full Report
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-white" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-white" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details - Shows when expanded */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                      <div className="space-y-6">
                        {/* Doctor Info */}
                        <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                          <h4 className="font-semibold text-teal-800 mb-3 flex items-center">
                            <Stethoscope className="h-5 w-5 mr-2" />
                            Doctor Information
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Name</p>
                              <p className="font-medium">
                                {report.doctor_name}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-medium">
                                {report.doctor_email}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Specialization
                              </p>
                              <p className="font-medium">
                                {report.doctor_specialization || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* MLT Info */}
                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                          <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                            <Microscope className="h-5 w-5 mr-2" />
                            MLT Information
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Name</p>
                              <p className="font-medium">{report.mlt_name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-medium">{report.mlt_email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Specialization
                              </p>
                              <p className="font-medium">
                                {report.mlt_specialization || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Patient Info */}
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                            <User className="h-5 w-5 mr-2" />
                            Patient Information
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Name</p>
                              <p className="font-medium">
                                {report.patient_name}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-medium">
                                {report.patient_email}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <p className="font-medium">
                                {report.patient_phone || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Age</p>
                              <p className="font-medium">
                                {report.patient_age || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Gender</p>
                              <p className="font-medium">
                                {report.patient_gender || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Blood Group
                              </p>
                              <p className="font-medium">
                                {report.patient_bloodGroup || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Test Details */}
                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                          <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
                            <Activity className="h-5 w-5 mr-2" />
                            Test Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Test Name</p>
                              <p className="font-medium">{report.test_name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Category</p>
                              <p className="font-medium">
                                {report.test_category}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Priority</p>
                              <p className="font-medium">
                                {report.test_priority}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Status</p>
                              <p className="font-medium">{report.status}</p>
                            </div>
                            {report.test_description && (
                              <div className="md:col-span-2">
                                <p className="text-sm text-gray-500">
                                  Description
                                </p>
                                <p className="font-medium">
                                  {report.test_description}
                                </p>
                              </div>
                            )}
                            {report.test_instructions && (
                              <div className="md:col-span-2">
                                <p className="text-sm text-gray-500">
                                  Instructions
                                </p>
                                <p className="font-medium">
                                  {report.test_instructions}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Clinical Details */}
                        {(report.suspected_disease ||
                          report.symptoms ||
                          report.clinical_notes ||
                          report.medical_history) && (
                          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                            <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                              <Heart className="h-5 w-5 mr-2" />
                              Clinical Details
                            </h4>
                            <div className="space-y-3">
                              {report.suspected_disease && (
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Suspected Disease
                                  </p>
                                  <p className="font-medium">
                                    {report.suspected_disease}
                                  </p>
                                </div>
                              )}
                              {report.symptoms && (
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Symptoms
                                  </p>
                                  <p className="font-medium">
                                    {report.symptoms}
                                  </p>
                                </div>
                              )}
                              {report.clinical_notes && (
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Clinical Notes
                                  </p>
                                  <p className="font-medium">
                                    {report.clinical_notes}
                                  </p>
                                </div>
                              )}
                              {report.medical_history && (
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Medical History
                                  </p>
                                  <p className="font-medium">
                                    {report.medical_history}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Medications */}
                        {report.medications &&
                          report.medications.length > 0 && (
                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                              <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                                <Pill className="h-5 w-5 mr-2" />
                                Medications ({report.medications.length})
                              </h4>
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead>
                                    <tr>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Name
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Dosage
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Frequency
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                        Duration
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {report.medications.map((med, idx) => (
                                      <tr key={idx}>
                                        <td className="px-4 py-2 text-sm font-medium">
                                          {med.name}
                                        </td>
                                        <td className="px-4 py-2 text-sm">
                                          {med.dosage || "N/A"}
                                        </td>
                                        <td className="px-4 py-2 text-sm">
                                          {med.frequency || "N/A"}
                                        </td>
                                        <td className="px-4 py-2 text-sm">
                                          {med.duration || "N/A"}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                        {/* Test Results (if completed) */}
                        {report.status === "completed" && (
                          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                              <CheckCircle className="h-5 w-5 mr-2" />
                              Test Results
                            </h4>
                            <div className="space-y-3">
                              {report.test_results && (
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Results
                                  </p>
                                  <p className="font-medium">
                                    {report.test_results}
                                  </p>
                                </div>
                              )}
                              {report.results_summary && (
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Summary
                                  </p>
                                  <p className="font-medium">
                                    {report.results_summary}
                                  </p>
                                </div>
                              )}
                              {report.test_conclusion && (
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Conclusion
                                  </p>
                                  <p className="font-medium">
                                    {report.test_conclusion}
                                  </p>
                                </div>
                              )}
                              {report.recommendations && (
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Recommendations
                                  </p>
                                  <p className="font-medium">
                                    {report.recommendations}
                                  </p>
                                </div>
                              )}
                              {report.mlt_notes && (
                                <div>
                                  <p className="text-sm text-gray-500">
                                    MLT Notes
                                  </p>
                                  <p className="font-medium">
                                    {report.mlt_notes}
                                  </p>
                                </div>
                              )}
                              {report.test_report_url && (
                                <div>
                                  <a
                                    href={report.test_report_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Report
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Cancelled Reason */}
                        {report.status === "cancelled" && report.mlt_notes && (
                          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                            <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                              <AlertCircle className="h-5 w-5 mr-2" />
                              Cancellation Reason
                            </h4>
                            <p className="text-red-700">{report.mlt_notes}</p>
                          </div>
                        )}

                        {/* Timestamps */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                            <CalendarIcon className="h-5 w-5 mr-2" />
                            Timeline
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Created</p>
                              <p className="font-medium">
                                {formatDate(report.createdAt)}
                              </p>
                            </div>
                            {report.assigned_date && (
                              <div>
                                <p className="text-sm text-gray-500">
                                  Assigned
                                </p>
                                <p className="font-medium">
                                  {formatDate(report.assigned_date)}
                                </p>
                              </div>
                            )}
                            {report.completed_date && (
                              <div>
                                <p className="text-sm text-gray-500">
                                  Completed
                                </p>
                                <p className="font-medium">
                                  {formatDate(report.completed_date)}
                                </p>
                              </div>
                            )}
                            <div>
                              <p className="text-sm text-gray-500">
                                Last Updated
                              </p>
                              <p className="font-medium">
                                {formatDate(report.updatedAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default TestReportsList;
