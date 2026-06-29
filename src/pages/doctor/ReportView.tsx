// pages/shared/ReportView.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FileText,
  User,
  Stethoscope,
  Microscope,
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
} from "lucide-react";
import toast from "react-hot-toast";
import testReportService from "../../services/testReportService";
import { type DetailedTestReport } from "../../types/testReport";

const ReportView = () => {
  const navigate = useNavigate();
  const { testId } = useParams();

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<DetailedTestReport | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    toast.success("Report link copied to clipboard!");
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600 mt-2">
            {error ||
              "Report not found or you do not have permission to view it"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center mx-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-teal-600" />
                  Test Report
                </h1>
                <p className="text-gray-600">{report.test_name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 flex-wrap gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  report.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : report.status === "in-progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </span>
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
              <button
                onClick={handleDownload}
                className="px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center text-sm"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </button>
              <button
                onClick={handleShare}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center text-sm"
              >
                <Printer className="h-4 w-4 mr-1" />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Report Body */}
        <div
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          id="report-content"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{report.test_name}</h2>
                <p className="text-teal-100">{report.test_category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-teal-100">Report Date</p>
                <p className="font-semibold">
                  {report.completed_date
                    ? new Date(report.completed_date).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Patient & Doctor Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <User className="h-4 w-4 mr-2 text-blue-600" />
                  Patient Information
                </h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-gray-500">Name:</span>{" "}
                    {report.patient_name}
                  </p>
                  <p>
                    <span className="text-gray-500">Email:</span>{" "}
                    {report.patient_email}
                  </p>
                  {report.patient_phone && (
                    <p>
                      <span className="text-gray-500">Phone:</span>{" "}
                      {report.patient_phone}
                    </p>
                  )}
                  {report.patient_age && (
                    <p>
                      <span className="text-gray-500">Age:</span>{" "}
                      {report.patient_age}
                    </p>
                  )}
                  {report.patient_gender && (
                    <p>
                      <span className="text-gray-500">Gender:</span>{" "}
                      {report.patient_gender}
                    </p>
                  )}
                  {report.patient_bloodGroup && (
                    <p>
                      <span className="text-gray-500">Blood Group:</span>{" "}
                      {report.patient_bloodGroup}
                    </p>
                  )}
                </div>
              </div>
              <div className="bg-teal-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <Stethoscope className="h-4 w-4 mr-2 text-teal-600" />
                  Doctor Information
                </h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-gray-500">Name:</span>{" "}
                    {report.doctor_name}
                  </p>
                  <p>
                    <span className="text-gray-500">Email:</span>{" "}
                    {report.doctor_email}
                  </p>
                  <p>
                    <span className="text-gray-500">Specialization:</span>{" "}
                    {report.doctor_specialization}
                  </p>
                </div>
              </div>
            </div>

            {/* MLT Info */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                <Microscope className="h-4 w-4 mr-2 text-purple-600" />
                MLT Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <p>
                  <span className="text-gray-500">Name:</span> {report.mlt_name}
                </p>
                <p>
                  <span className="text-gray-500">Email:</span>{" "}
                  {report.mlt_email}
                </p>
                <p>
                  <span className="text-gray-500">Specialization:</span>{" "}
                  {report.mlt_specialization}
                </p>
              </div>
            </div>

            {/* Test Results */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Test Results
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">
                {report.test_results || "No results provided"}
              </div>
            </div>

            {/* Test Parameters */}
            {report.test_parameters && report.test_parameters.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Test Parameters
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Parameter
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Value
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Unit
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Normal Range
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {report.test_parameters.map((param, index) => (
                        <tr key={index}>
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
                            {param.is_abnormal ? (
                              <span className="text-red-600 flex items-center">
                                <XCircle className="h-4 w-4 mr-1" />
                                Abnormal
                              </span>
                            ) : (
                              <span className="text-green-600 flex items-center">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Normal
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Normal Ranges */}
            {report.normal_ranges && report.normal_ranges.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Normal Reference Ranges
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {report.normal_ranges.map((range, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
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

            {/* Interpretation & Conclusion */}
            <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {report.interpretation && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-teal-600" />
                    Interpretation
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm">
                    {report.interpretation}
                  </div>
                </div>
              )}
              {report.clinical_impression && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <Heart className="h-4 w-4 mr-2 text-red-500" />
                    Clinical Impression
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm">
                    {report.clinical_impression}
                  </div>
                </div>
              )}
            </div>

            {/* Summary & Conclusion */}
            {report.results_summary && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Summary
                </h3>
                <div className="bg-yellow-50 rounded-lg p-4">
                  {report.results_summary}
                </div>
              </div>
            )}

            {report.test_conclusion && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Conclusion
                </h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  {report.test_conclusion}
                </div>
              </div>
            )}

            {/* Recommendations & Follow-up */}
            <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {report.recommendations && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <Pill className="h-4 w-4 mr-2 text-teal-600" />
                    Recommendations
                  </h3>
                  <div className="bg-green-50 rounded-lg p-4 text-sm">
                    {report.recommendations}
                  </div>
                </div>
              )}
              {report.follow_up_instructions && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-600" />
                    Follow-up Instructions
                  </h3>
                  <div className="bg-indigo-50 rounded-lg p-4 text-sm">
                    {report.follow_up_instructions}
                  </div>
                </div>
              )}
            </div>

            {/* Attached File */}
            {report.test_report_url && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-600" />
                  Attached File
                </h3>
                <a
                  href={report.test_report_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  View Attached File
                </a>
              </div>
            )}

            {/* MLT Notes */}
            {report.mlt_notes && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  MLT Notes
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  {report.mlt_notes}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t pt-6 text-sm text-gray-500 flex flex-wrap justify-between">
              <div>
                <p>Report ID: {report._id}</p>
                <p>Version: {report.report_version || 1}</p>
              </div>
              <div>
                <p>Created: {new Date(report.createdAt).toLocaleString()}</p>
                <p>
                  Last Updated: {new Date(report.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
