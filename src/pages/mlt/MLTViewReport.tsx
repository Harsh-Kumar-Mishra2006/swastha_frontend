// pages/mlt/MLTReportView.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FileText,
  User,
  Stethoscope,
  Microscope,
  Calendar,
  Clock,
  Download,
  Share2,
  Printer,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  XCircle,
  Activity,
  Heart,
  Pill,
  Edit,
  Trash2,
  Copy,
  Mail,
  Phone,
  Award,
  FileCheck,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Upload,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import testReportService from "../../services/testReportService";
import {
  type DetailedTestReport,
  type TestParameter,
} from "../../types/testReport";

const MLTReportView = () => {
  const navigate = useNavigate();
  const { testId } = useParams();

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<DetailedTestReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (testId) {
      fetchReport();
    }
  }, [testId]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await testReportService.getDetailedReport(testId!);
      if (response.success) {
        setReport(response.data);
      } else {
        setError("Failed to load report");
      }
    } catch (error: any) {
      console.error("❌ Error fetching report:", error);
      setError(error.response?.data?.error || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await testReportService.downloadReport(testId!);
      if (response.success && response.url) {
        window.open(response.url, "_blank");
      } else {
        toast("PDF download not available yet", {
          icon: "ℹ️",
          duration: 3000,
        });
      }
    } catch (error) {
      toast.error("Failed to download report");
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/reports/share/${testId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Report link copied to clipboard!");
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    navigate(`/mlt/create-report/${testId}`);
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
          icon: RefreshCw,
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

  const getParameterStatus = (param: TestParameter) => {
    if (!param.normal_range) return null;

    // Simple logic to determine if value is abnormal
    // You can make this more sophisticated based on your needs
    const value = parseFloat(param.value);
    if (isNaN(value)) return null;

    // Extract numeric range from normal_range string (e.g., "12-16 g/dL")
    const rangeMatch = param.normal_range.match(/(\d+)\s*-\s*(\d+)/);
    if (rangeMatch) {
      const min = parseFloat(rangeMatch[1]);
      const max = parseFloat(rangeMatch[2]);
      if (value < min) {
        return {
          status: "low",
          color: "text-blue-600",
          icon: TrendingDown,
          label: "Low",
        };
      } else if (value > max) {
        return {
          status: "high",
          color: "text-red-600",
          icon: TrendingUp,
          label: "High",
        };
      }
    }
    return {
      status: "normal",
      color: "text-green-600",
      icon: CheckCircle,
      label: "Normal",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-teal-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-teal-50">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Report Not Found</h2>
          <p className="text-gray-600 mt-2">
            {error ||
              "Report not found or you do not have permission to view it"}
          </p>
          <button
            onClick={() => navigate("/mlt/dashboard")}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-lg hover:from-purple-700 hover:to-teal-700 flex items-center mx-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isCompleted = report.status === "completed";
  const isInProgress = report.status === "in-progress";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/mlt/dashboard")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-purple-600" />
                  Test Report
                </h1>
                <p className="text-gray-600">{report.test_name}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {getStatusBadge(report.status)}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  report.test_priority === "emergency"
                    ? "bg-red-100 text-red-800"
                    : report.test_priority === "urgent"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {report.test_priority.charAt(0).toUpperCase() +
                  report.test_priority.slice(1)}
              </span>
              {isCompleted && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Completed
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center text-sm transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm transition-colors"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Report
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center text-sm transition-colors"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
            {!isCompleted && (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center text-sm transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                {isInProgress ? "Continue Report" : "Complete Report"}
              </button>
            )}
            {isCompleted && (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center text-sm transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Update Report
              </button>
            )}
            <button
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to delete this report?")
                ) {
                  toast.error("Delete functionality coming soon");
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center text-sm transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Share Report
                </h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Share this report with patients or doctors using the link below:
              </p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={`${window.location.origin}/reports/share/${testId}`}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <button
                  onClick={handleShare}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  Email
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                  WhatsApp
                </button>
                <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                  SMS
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Report Body */}
        <div
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          id="report-content"
        >
          {/* Report Header */}
          <div className="bg-gradient-to-r from-purple-600 via-teal-600 to-emerald-600 text-white p-8">
            <div className="flex flex-wrap items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <FileCheck className="h-8 w-8" />
                  <h2 className="text-2xl font-bold">Lab Test Report</h2>
                </div>
                <p className="text-purple-100 mt-1">{report.test_category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-purple-100">Report ID</p>
                <p className="font-mono text-sm bg-white bg-opacity-20 px-3 py-1 rounded-lg">
                  {report._id.slice(-8).toUpperCase()}
                </p>
                <p className="text-sm text-purple-100 mt-1">
                  Version {report.report_version || 1}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {report.test_name}
                </div>
                <div className="text-xs text-gray-500">Test Name</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {report.patient_name}
                </div>
                <div className="text-xs text-gray-500">Patient</div>
              </div>
              <div className="bg-teal-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-teal-600">
                  {report.completed_date
                    ? new Date(report.completed_date).toLocaleDateString()
                    : "N/A"}
                </div>
                <div className="text-xs text-gray-500">Report Date</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {report.test_parameters?.filter((p) => p.is_abnormal)
                    .length || 0}
                </div>
                <div className="text-xs text-gray-500">Abnormal Results</div>
              </div>
            </div>

            {/* Patient & Doctor Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Patient Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-500 w-24">Name:</span>
                    <span className="font-medium text-gray-900">
                      {report.patient_name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-500 w-24">Email:</span>
                    <span className="font-medium text-gray-900">
                      {report.patient_email}
                    </span>
                  </div>
                  {report.patient_phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-500 w-24">Phone:</span>
                      <span className="font-medium text-gray-900">
                        {report.patient_phone}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    {report.patient_age && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-500">
                          Age: {report.patient_age}
                        </span>
                      </div>
                    )}
                    {report.patient_gender && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-500">
                          Gender: {report.patient_gender}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <Stethoscope className="h-5 w-5 mr-2 text-teal-600" />
                  Doctor Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-500 w-24">Name:</span>
                    <span className="font-medium text-gray-900">
                      {report.doctor_name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-500 w-24">Email:</span>
                    <span className="font-medium text-gray-900">
                      {report.doctor_email}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-500 w-24">Specialization:</span>
                    <span className="font-medium text-gray-900">
                      {report.doctor_specialization}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* MLT Info */}
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                <Microscope className="h-5 w-5 mr-2 text-purple-600" />
                MLT Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-500 w-20">Name:</span>
                  <span className="font-medium text-gray-900">
                    {report.mlt_name}
                  </span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-500 w-20">Email:</span>
                  <span className="font-medium text-gray-900">
                    {report.mlt_email}
                  </span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-500 w-20">Specialization:</span>
                  <span className="font-medium text-gray-900">
                    {report.mlt_specialization}
                  </span>
                </div>
              </div>
            </div>

            {/* Test Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ClipboardList className="h-5 w-5 mr-2 text-teal-600" />
                Test Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Test Name</p>
                  <p className="font-medium text-gray-900">
                    {report.test_name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium text-gray-900">
                    {report.test_category}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Priority</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {report.test_priority}
                  </p>
                </div>
              </div>
              {report.test_instructions && (
                <div className="mt-3 bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Instructions:</strong> {report.test_instructions}
                  </p>
                </div>
              )}
            </div>

            {/* Test Results */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-teal-600" />
                Test Results
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap border border-gray-200">
                {report.test_results || "No results provided"}
              </div>
            </div>

            {/* Test Parameters */}
            {report.test_parameters && report.test_parameters.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-teal-600" />
                  Test Parameters
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Parameter
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Value
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unit
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Normal Range
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {report.test_parameters.map((param, index) => {
                        const status = getParameterStatus(param);
                        return (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {param.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {param.value}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {param.unit}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {param.normal_range}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {status ? (
                                <span
                                  className={`inline-flex items-center ${status.color}`}
                                >
                                  {status.status === "normal" ? (
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                  ) : status.status === "high" ? (
                                    <TrendingUp className="h-4 w-4 mr-1" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4 mr-1" />
                                  )}
                                  {status.label}
                                </span>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                    High
                  </span>
                  <span className="flex items-center">
                    <TrendingDown className="h-4 w-4 text-blue-500 mr-1" />
                    Low
                  </span>
                  <span className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    Normal
                  </span>
                </div>
              </div>
            )}

            {/* Normal Ranges */}
            {report.normal_ranges && report.normal_ranges.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-teal-600" />
                  Normal Reference Ranges
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {report.normal_ranges.map((range, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                    >
                      <p className="font-medium text-gray-900">
                        {range.parameter}
                      </p>
                      <p className="text-sm text-gray-600">
                        Range: {range.range}
                      </p>
                      {range.description && (
                        <p className="text-sm text-gray-500">
                          {range.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clinical Interpretation */}
            <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {report.interpretation && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-purple-600" />
                    Interpretation
                  </h3>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    {report.interpretation}
                  </div>
                </div>
              )}
              {report.clinical_impression && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    Clinical Impression
                  </h3>
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    {report.clinical_impression}
                  </div>
                </div>
              )}
            </div>

            {/* Summary & Conclusion */}
            {report.results_summary && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <ClipboardList className="h-5 w-5 mr-2 text-yellow-600" />
                  Results Summary
                </h3>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  {report.results_summary}
                </div>
              </div>
            )}

            {report.test_conclusion && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-blue-600" />
                  Conclusion
                </h3>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  {report.test_conclusion}
                </div>
              </div>
            )}

            {/* Recommendations & Follow-up */}
            <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {report.recommendations && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Pill className="h-5 w-5 mr-2 text-green-600" />
                    Recommendations
                  </h3>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    {report.recommendations}
                  </div>
                </div>
              )}
              {report.follow_up_instructions && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-indigo-600" />
                    Follow-up Instructions
                  </h3>
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                    {report.follow_up_instructions}
                  </div>
                </div>
              )}
            </div>

            {/* Attached File */}
            {report.test_report_url && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Upload className="h-5 w-5 mr-2 text-gray-600" />
                  Attached Document
                </h3>
                <a
                  href={report.test_report_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Attached File
                </a>
              </div>
            )}

            {/* MLT Notes */}
            {report.mlt_notes && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Microscope className="h-5 w-5 mr-2 text-purple-600" />
                  MLT Notes
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  {report.mlt_notes}
                </div>
              </div>
            )}

            {/* Symptoms & Medical History */}
            <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {report.symptoms && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-orange-600" />
                    Symptoms
                  </h3>
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    {report.symptoms}
                  </div>
                </div>
              )}
              {report.medical_history && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-gray-600" />
                    Medical History
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    {report.medical_history}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t pt-6">
              <div className="flex flex-wrap justify-between items-center text-sm text-gray-500">
                <div className="space-y-1">
                  <p>
                    Report ID: <span className="font-mono">{report._id}</span>
                  </p>
                  <p>Version: {report.report_version || 1}</p>
                  <p>
                    Status:{" "}
                    {report.status.charAt(0).toUpperCase() +
                      report.status.slice(1)}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p>Created: {new Date(report.createdAt).toLocaleString()}</p>
                  <p>
                    Last Updated: {new Date(report.updatedAt).toLocaleString()}
                  </p>
                  {report.completed_date && (
                    <p>
                      Completed:{" "}
                      {new Date(report.completed_date).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
                <p>
                  This report is confidential and intended for medical
                  professionals only.
                </p>
                <p className="mt-1">Generated by Lab Management System</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLTReportView;
