// pages/mlt/MLTTestRequests.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock,
  Loader,
  User,
  Stethoscope,
  Microscope,
  FileText,
  Calendar,
  Search,
  Download,
  Send,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";
import testReportService from "../../services/testReportService";
import { type TestReport } from "../../types/testReport";

const MLTTestRequests = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [testRequests, setTestRequests] = useState<TestReport[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<TestReport | null>(
    null,
  );
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Submit results form state
  const [resultForm, setResultForm] = useState({
    test_results: "",
    results_summary: "",
    test_conclusion: "",
    recommendations: "",
    mlt_notes: "",
  });
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTestRequests();
    }
  }, [user, filter]);

  const fetchTestRequests = async () => {
    try {
      setLoading(true);
      const response = await testReportService.getMLTTestRequests(
        user?.id || "",
        filter !== "all" ? filter : undefined,
      );
      if (response.success) {
        setTestRequests(response.data);
        setStats(response.statistics);
        if (response.data.length > 0 && !selectedRequest) {
          setSelectedRequest(response.data[0]);
        }
      }
    } catch (error) {
      toast.error("Failed to load test requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (testId: string) => {
    try {
      const response = await testReportService.acceptAssignment(testId);
      if (response.success) {
        toast.success("Test assignment accepted!");
        fetchTestRequests();
      }
    } catch (error) {
      toast.error("Failed to accept assignment");
    }
  };

  const handleReject = async (testId: string) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason) return;

    try {
      const response = await testReportService.rejectAssignment(testId, reason);
      if (response.success) {
        toast.success("Test assignment rejected");
        fetchTestRequests();
      }
    } catch (error) {
      toast.error("Failed to reject assignment");
    }
  };

  const handleStart = async (testId: string) => {
    try {
      const response = await testReportService.startTest(testId);
      if (response.success) {
        toast.success("Test started! You can now submit results.");
        fetchTestRequests();
      }
    } catch (error) {
      toast.error("Failed to start test");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReportFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitResults = async (testId: string) => {
    if (!resultForm.test_results) {
      toast.error("Please enter test results");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await testReportService.submitTestResults(testId, {
        test_results: resultForm.test_results,
        results_summary: resultForm.results_summary,
        test_conclusion: resultForm.test_conclusion,
        recommendations: resultForm.recommendations,
        mlt_notes: resultForm.mlt_notes,
        test_report_file: reportFile || undefined,
      });

      if (response.success) {
        toast.success("Test results submitted successfully!");
        setShowSubmitModal(false);
        setResultForm({
          test_results: "",
          results_summary: "",
          test_conclusion: "",
          recommendations: "",
          mlt_notes: "",
        });
        setReportFile(null);
        setPreviewUrl(null);
        fetchTestRequests();
      }
    } catch (error) {
      toast.error("Failed to submit test results");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
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
    const config = configs[status as keyof typeof configs] || configs.pending;
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
    const configs = {
      routine: { color: "bg-gray-100 text-gray-800", label: "Routine" },
      urgent: { color: "bg-orange-100 text-orange-800", label: "Urgent" },
      emergency: { color: "bg-red-100 text-red-800", label: "Emergency" },
    };
    const config = configs[priority as keyof typeof configs] || configs.routine;
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const filteredRequests = testRequests.filter(
    (request) =>
      request.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              MLT Test Requests
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage test requests from doctors
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Logged in as:</span>
            <span className="font-medium text-purple-600">{user?.name}</span>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              {
                label: "Total",
                value: stats.total,
                color: "bg-blue-50 text-blue-600",
                icon: ClipboardList,
              },
              {
                label: "Pending",
                value: stats.pending,
                color: "bg-yellow-50 text-yellow-600",
                icon: Clock,
              },
              {
                label: "Assigned",
                value: stats.assigned,
                color: "bg-purple-50 text-purple-600",
                icon: User,
              },
              {
                label: "In Progress",
                value: stats["in-progress"],
                color: "bg-indigo-50 text-indigo-600",
                icon: Loader,
              },
              {
                label: "Completed",
                value: stats.completed,
                color: "bg-green-50 text-green-600",
                icon: CheckCircle,
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`${stat.color} rounded-xl p-4 text-center transition-transform hover:scale-105`}
                >
                  <Icon className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm">{stat.label}</div>
                </div>
              );
            })}
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
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient, test, doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 w-64"
              />
            </div>
          </div>
        </div>

        {/* Test Requests List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredRequests.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No test requests found</p>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <button
                  key={request._id}
                  onClick={() => setSelectedRequest(request)}
                  className={`w-full text-left bg-white rounded-xl p-4 shadow-sm transition-all hover:shadow-md ${
                    selectedRequest?._id === request._id
                      ? "ring-2 ring-purple-500 border-transparent"
                      : "border border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-gray-900 truncate">
                          {request.test_name}
                        </p>
                        {getPriorityBadge(request.test_priority)}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        Patient: {request.patient_name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        Doctor: {request.doctor_name}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="ml-2">{getStatusBadge(request.status)}</div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-2">
            {selectedRequest ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6 pb-4 border-b">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedRequest.test_name}
                      </h2>
                      {getPriorityBadge(selectedRequest.test_priority)}
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                    <p className="text-gray-600 mt-1">
                      {selectedRequest.test_category}
                    </p>
                  </div>
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
                        {selectedRequest.doctor_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium">
                        {selectedRequest.doctor_email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Specialization</p>
                      <p className="font-medium">
                        {selectedRequest.doctor_specialization}
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
                        {selectedRequest.patient_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium">
                        {selectedRequest.patient_email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="font-medium">
                        {selectedRequest.patient_phone || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Age/Gender</p>
                      <p className="font-medium">
                        {selectedRequest.patient_age || "N/A"} /{" "}
                        {selectedRequest.patient_gender || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Test Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <Microscope className="h-4 w-4 mr-2 text-purple-600" />
                    Test Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-500">Suspected Disease</p>
                      <p className="font-medium">
                        {selectedRequest.suspected_disease || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Symptoms</p>
                      <p className="font-medium">
                        {selectedRequest.symptoms || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Clinical Notes</p>
                      <p className="font-medium">
                        {selectedRequest.clinical_notes || "Not specified"}
                      </p>
                    </div>
                    {selectedRequest.test_instructions && (
                      <div>
                        <p className="text-gray-500">Test Instructions</p>
                        <p className="font-medium">
                          {selectedRequest.test_instructions}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t">
                  {selectedRequest.status === "pending" && (
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleAccept(selectedRequest._id)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                      >
                        <CheckCircle className="h-5 w-5" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleReject(selectedRequest._id)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2"
                      >
                        <XCircle className="h-5 w-5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}

                  {selectedRequest.status === "assigned" && (
                    <button
                      onClick={() => handleStart(selectedRequest._id)}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-2"
                    >
                      <Loader className="h-5 w-5" />
                      <span>Start Test</span>
                    </button>
                  )}

                  {selectedRequest.status === "in-progress" && (
                    <button
                      onClick={() => setShowSubmitModal(true)}
                      className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center space-x-2"
                    >
                      <Upload className="h-5 w-5" />
                      <span>Submit Results</span>
                    </button>
                  )}

                  {selectedRequest.status === "completed" && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h3 className="font-semibold text-green-800 mb-2">
                        Test Results
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-gray-500">Results</p>
                          <p className="font-medium">
                            {selectedRequest.test_results ||
                              "No results provided"}
                          </p>
                        </div>
                        {selectedRequest.results_summary && (
                          <div>
                            <p className="text-gray-500">Summary</p>
                            <p className="font-medium">
                              {selectedRequest.results_summary}
                            </p>
                          </div>
                        )}
                        {selectedRequest.test_conclusion && (
                          <div>
                            <p className="text-gray-500">Conclusion</p>
                            <p className="font-medium">
                              {selectedRequest.test_conclusion}
                            </p>
                          </div>
                        )}
                        {selectedRequest.test_report_url && (
                          <a
                            href={selectedRequest.test_report_url}
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

                  {selectedRequest.status === "cancelled" && (
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <p className="text-red-700 font-medium">Test Cancelled</p>
                      <p className="text-red-600 text-sm">
                        {selectedRequest.mlt_notes || "No reason provided"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center">
                <ClipboardList className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Select a test request to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Results Modal */}
      {showSubmitModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Submit Test Results
                </h2>
                <p className="text-gray-600">
                  Enter results for: {selectedRequest.test_name}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  setResultForm({
                    test_results: "",
                    results_summary: "",
                    test_conclusion: "",
                    recommendations: "",
                    mlt_notes: "",
                  });
                  setReportFile(null);
                  setPreviewUrl(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XCircle className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Patient</p>
                  <p className="font-medium">{selectedRequest.patient_name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Doctor</p>
                  <p className="font-medium">{selectedRequest.doctor_name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Test</p>
                  <p className="font-medium">{selectedRequest.test_name}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Results *
                </label>
                <textarea
                  rows={4}
                  value={resultForm.test_results}
                  onChange={(e) =>
                    setResultForm({
                      ...resultForm,
                      test_results: e.target.value,
                    })
                  }
                  placeholder="Enter detailed test results..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Results Summary
                </label>
                <textarea
                  rows={2}
                  value={resultForm.results_summary}
                  onChange={(e) =>
                    setResultForm({
                      ...resultForm,
                      results_summary: e.target.value,
                    })
                  }
                  placeholder="Brief summary of results..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conclusion
                </label>
                <textarea
                  rows={2}
                  value={resultForm.test_conclusion}
                  onChange={(e) =>
                    setResultForm({
                      ...resultForm,
                      test_conclusion: e.target.value,
                    })
                  }
                  placeholder="Medical conclusion based on results..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recommendations
                </label>
                <textarea
                  rows={2}
                  value={resultForm.recommendations}
                  onChange={(e) =>
                    setResultForm({
                      ...resultForm,
                      recommendations: e.target.value,
                    })
                  }
                  placeholder="Recommendations for the doctor..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MLT Notes
                </label>
                <textarea
                  rows={2}
                  value={resultForm.mlt_notes}
                  onChange={(e) =>
                    setResultForm({ ...resultForm, mlt_notes: e.target.value })
                  }
                  placeholder="Any additional notes..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Report File (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-teal-400 transition-colors">
                  <input
                    type="file"
                    id="report-file"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="report-file" className="cursor-pointer block">
                    {previewUrl ? (
                      <div>
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-32 mx-auto rounded"
                        />
                        <p className="text-sm text-green-600 mt-2">
                          File uploaded successfully
                        </p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Click to upload report</p>
                        <p className="text-xs text-gray-400 mt-1">
                          PDF, Word, or Images (max 10MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <button
                onClick={() => handleSubmitResults(selectedRequest._id)}
                disabled={isSubmitting || !resultForm.test_results}
                className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MLTTestRequests;
