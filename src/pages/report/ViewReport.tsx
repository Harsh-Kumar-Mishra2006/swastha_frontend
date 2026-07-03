// pages/report/ViewReport.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import testReportService from "../../services/createReportService";
import { type TestReport } from "../../types/testReport";
import {
  FileText,
  Download,
  Printer,
  ArrowLeft,
  User,
  Stethoscope,
  Mail,
  Phone,
  AlertCircle,
  File,
  History,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const ViewReport: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<TestReport | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState<any>(null);

  useEffect(() => {
    if (testId) {
      loadReport();
    }
  }, [testId]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const response = await testReportService.getTestReport(testId!);
      if (response.success) {
        setReport(response.data);
      }
    } catch (error: any) {
      if (error?.response?.status === 403) {
        toast.error("You do not have permission to view this report");
      } else {
        toast.error("Failed to load report");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await testReportService.getReportHistory(testId!);
      if (response.success) {
        setHistoryData(response.data);
        setShowHistory(true);
      }
    } catch (error) {
      toast.error("Failed to load report history");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      assigned: { color: "bg-blue-100 text-blue-800", label: "Assigned" },
      "in-progress": {
        color: "bg-purple-100 text-purple-800",
        label: "In Progress",
      },
      completed: { color: "bg-green-100 text-green-800", label: "Completed" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
    };
    const config = configs[status as keyof typeof configs] || configs.pending;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        {config.label}
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <p className="text-gray-600">Report not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-teal-600 hover:text-teal-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  // If report is not completed, show limited view
  if (report.status !== "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Report In Progress
            </h2>
            <p className="text-gray-600 mb-4">
              This test report is currently <strong>{report.status}</strong>.
              {report.mlt_name &&
                ` It is being prepared by ${report.mlt_name}.`}
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Go Back
              </button>
              {user?.role === "MLT" && (
                <button
                  onClick={() => navigate(`/mlt/create-report/${testId}`)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  {report.status === "in-progress"
                    ? "Continue Editing"
                    : "Start Report"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FileText className="h-6 w-6 text-teal-600 mr-2" />
                Test Report
              </h1>
              <p className="text-sm text-gray-600">
                {report.test_name} • {report.patient_name}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 flex items-center border border-gray-200"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
            {report.test_report_url && (
              <a
                href={report.test_report_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </a>
            )}
            <button
              onClick={loadHistory}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center"
            >
              <History className="h-4 w-4 mr-2" />
              History
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden print:shadow-none">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-6 text-white print:bg-teal-700">
            <div className="flex flex-wrap justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{report.test_name}</h2>
                <p className="text-teal-100 text-sm">
                  Report ID: {report._id.slice(-8).toUpperCase()}
                </p>
              </div>
              <div className="text-right print:text-left">
                {getStatusBadge(report.status)}
                <p className="text-sm text-teal-100 mt-1">
                  Version {report.report_version || 1}
                </p>
              </div>
            </div>
          </div>

          {/* Patient & Doctor Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                <User className="h-4 w-4 inline mr-2" />
                Patient Information
              </h3>
              <div className="space-y-1">
                <p className="font-medium">{report.patient_name}</p>
                <p className="text-sm text-gray-600 flex items-center">
                  <Mail className="h-3 w-3 mr-1" />
                  {report.patient_email}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  {report.patient_phone}
                </p>
                {(report.patient_age || report.patient_gender) && (
                  <p className="text-sm text-gray-600">
                    {report.patient_age && `${report.patient_age} years`}
                    {report.patient_age && report.patient_gender && " • "}
                    {report.patient_gender && report.patient_gender}
                    {report.patient_bloodGroup &&
                      ` • Blood: ${report.patient_bloodGroup}`}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                <Stethoscope className="h-4 w-4 inline mr-2" />
                Doctor & MLT Information
              </h3>
              <div className="space-y-1">
                <p className="font-medium">{report.doctor_name}</p>
                <p className="text-sm text-gray-600">
                  {report.doctor_specialization}
                </p>
                <p className="text-sm text-gray-500 flex items-center">
                  <Mail className="h-3 w-3 mr-1" />
                  {report.doctor_email}
                </p>
                {report.mlt_name && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Conducted by:</p>
                    <p className="font-medium">{report.mlt_name}</p>
                    <p className="text-sm text-gray-600">
                      {report.mlt_specialization}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Test Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b bg-gray-50">
            <div>
              <p className="text-xs text-gray-500 uppercase">Category</p>
              <p className="font-medium">{report.test_category}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Priority</p>
              {getPriorityBadge(report.test_priority)}
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Assigned Date</p>
              <p className="font-medium text-sm">
                {new Date(
                  report.assigned_date || report.createdAt,
                ).toLocaleDateString()}
              </p>
            </div>
            {report.completed_date && (
              <div>
                <p className="text-xs text-gray-500 uppercase">
                  Completed Date
                </p>
                <p className="font-medium text-sm">
                  {new Date(report.completed_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Test Results */}
          <div className="p-6 border-b">
            <h3 className="font-semibold text-gray-900 mb-3">Test Results</h3>
            <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">
              {report.test_results || "No results entered"}
            </div>
          </div>

          {/* Test Parameters */}
          {report.test_parameters && report.test_parameters.length > 0 && (
            <div className="p-6 border-b">
              <h3 className="font-semibold text-gray-900 mb-3">
                Test Parameters
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left font-medium text-gray-500">
                        Parameter
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">
                        Value
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">
                        Unit
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">
                        Normal Range
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.test_parameters.map((param, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2 font-medium">{param.name}</td>
                        <td className="px-4 py-2">{param.value}</td>
                        <td className="px-4 py-2 text-gray-500">
                          {param.unit}
                        </td>
                        <td className="px-4 py-2 text-gray-500">
                          {param.normal_range}
                        </td>
                        <td className="px-4 py-2">
                          {param.is_abnormal ? (
                            <span className="text-red-600">⚠ Abnormal</span>
                          ) : (
                            <span className="text-green-600">✓ Normal</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Interpretation & Impression */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Interpretation
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                {report.interpretation || "Not provided"}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Clinical Impression
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                {report.clinical_impression || "Not provided"}
              </div>
            </div>
          </div>

          {/* Summary & Conclusion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Results Summary
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                {report.results_summary || "Not provided"}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Test Conclusion
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                {report.test_conclusion || "Not provided"}
              </div>
            </div>
          </div>

          {/* Recommendations & Follow-up */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Recommendations
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                {report.recommendations || "Not provided"}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Follow-up Instructions
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                {report.follow_up_instructions || "Not provided"}
              </div>
            </div>
          </div>

          {/* Normal Ranges Reference */}
          {report.normal_ranges && report.normal_ranges.length > 0 && (
            <div className="p-6 border-b">
              <h3 className="font-semibold text-gray-900 mb-3">
                Normal Ranges Reference
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {report.normal_ranges.map((range, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium">{range.parameter}</p>
                    <p className="text-sm text-gray-600">{range.range}</p>
                    {range.description && (
                      <p className="text-xs text-gray-500 mt-1">
                        {range.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Symptoms & Clinical Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Symptoms</h3>
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                {report.symptoms || "Not provided"}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Clinical Notes
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                {report.clinical_notes || "Not provided"}
              </div>
            </div>
          </div>

          {/* Medications */}
          {report.medications && report.medications.length > 0 && (
            <div className="p-6 border-b">
              <h3 className="font-semibold text-gray-900 mb-3">
                Prescribed Medications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {report.medications.map((med, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium">{med.name}</p>
                    <p className="text-sm text-gray-600">
                      {med.dosage} • {med.frequency}
                    </p>
                    {med.duration && (
                      <p className="text-xs text-gray-500">
                        Duration: {med.duration}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attached File */}
          {report.test_report_url && (
            <div className="p-6 border-b">
              <h3 className="font-semibold text-gray-900 mb-3">
                Attached Report File
              </h3>
              <a
                href={report.test_report_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100"
              >
                <File className="h-5 w-5 mr-2" />
                View Attached File
              </a>
            </div>
          )}

          {/* Footer */}
          <div className="p-6 bg-gray-50 text-sm text-gray-500 flex flex-wrap justify-between">
            <div>
              <p>Report ID: {report._id}</p>
              <p>Generated: {new Date(report.updatedAt).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-700">
                {report.mlt_name && `Reported by: ${report.mlt_name}`}
              </p>
              <p className="text-xs">Version {report.report_version || 1}</p>
            </div>
          </div>
        </div>
      </div>

      {/* History Modal */}
      {showHistory && historyData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <History className="h-5 w-5 mr-2 text-teal-600" />
                Report History
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  Current Version: {historyData.currentVersion}
                </p>
                <p className="text-sm text-gray-500">
                  Last Updated:{" "}
                  {new Date(historyData.lastUpdated).toLocaleString()}
                </p>
              </div>
              {historyData.history && historyData.history.length > 0 ? (
                <div className="space-y-4">
                  {historyData.history.map((version: any, index: number) => (
                    <div
                      key={index}
                      className="border-l-4 border-teal-200 pl-4"
                    >
                      <p className="text-sm font-medium text-gray-700">
                        Version {historyData.currentVersion - index - 1}
                      </p>
                      <p className="text-xs text-gray-500">
                        Updated: {new Date(version.updatedAt).toLocaleString()}
                      </p>
                      {version.updatedBy && (
                        <p className="text-xs text-gray-500">
                          By: {version.updatedBy}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {version.results_summary ||
                          version.test_results?.substring(0, 100) ||
                          "No details"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No previous versions available
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewReport;
