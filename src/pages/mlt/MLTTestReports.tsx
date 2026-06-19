// pages/mlt/MLTTestReports.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  ClipboardList,
  FlaskConical,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Loader,
  User,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Upload,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

interface TestReport {
  _id: string;
  test_name: string;
  test_category: string;
  test_priority: "routine" | "urgent" | "emergency";
  status: "pending" | "assigned" | "in-progress" | "completed" | "cancelled";
  patientId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    profile?: {
      age?: string;
      gender?: string;
      bloodGroup?: string;
    };
  };
  doctorId: {
    _id: string;
    name: string;
    email: string;
    specialization: string;
  };
  symptoms: string;
  suspected_disease: string;
  clinical_notes: string;
  test_instructions: string;
  test_results?: string;
  results_summary?: string;
  test_conclusion?: string;
  recommendations?: string;
  test_report_url?: string;
  completed_date?: string;
  createdAt: string;
  assigned_date: string;
  mlt_notes?: string;
}

const MLTTestReports = () => {
  const { user } = useAuth(); // user has 'id' not '_id'
  const [loading, setLoading] = useState(true);
  const [testRequests, setTestRequests] = useState<TestReport[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<TestReport | null>(
    null,
  );
  const [filter, setFilter] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    requests: true,
    submit: true,
  });

  // Form state for submitting results
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
      // ✅ Use user.id instead of user._id
      const response = await api.get(`/test-reports/mlt/${user?.id}`, {
        params: { status: filter !== "all" ? filter : undefined },
      });
      if (response.data.success) {
        setTestRequests(response.data.data);
        setStats(response.data.statistics);
        if (response.data.data.length > 0 && !selectedRequest) {
          setSelectedRequest(response.data.data[0]);
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
      const response = await api.put(`/test-reports/${testId}/accept`, {
        mlt_notes: "Accepted assignment",
      });
      if (response.data.success) {
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
      const response = await api.put(`/test-reports/${testId}/reject`, {
        rejection_reason: reason,
      });
      if (response.data.success) {
        toast.success("Test assignment rejected");
        fetchTestRequests();
      }
    } catch (error) {
      toast.error("Failed to reject assignment");
    }
  };

  const handleStart = async (testId: string) => {
    try {
      const response = await api.put(`/test-reports/${testId}/start`, {
        mlt_notes: "Started working on test",
      });
      if (response.data.success) {
        toast.success("Test started!");
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
      const formData = new FormData();
      formData.append("test_results", resultForm.test_results);
      formData.append("results_summary", resultForm.results_summary);
      formData.append("test_conclusion", resultForm.test_conclusion);
      formData.append("recommendations", resultForm.recommendations);
      formData.append("mlt_notes", resultForm.mlt_notes);
      if (reportFile) {
        formData.append("test_report_file", reportFile);
      }

      const response = await api.put(
        `/test-reports/${testId}/submit`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (response.data.success) {
        toast.success("Test results submitted successfully!");
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
      request.patientId?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      request.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.doctorId?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
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
              MLT Test Reports
            </h1>
            <p className="text-gray-600 mt-1">
              Receive test requests and submit test results
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

        {/* SECTION 1: Get Test Requests from Doctor */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <button
            onClick={() =>
              setIsDropdownOpen({
                ...isDropdownOpen,
                requests: !isDropdownOpen.requests,
              })
            }
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-between hover:from-purple-600 hover:to-pink-600 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <ClipboardList className="h-6 w-6" />
              <span className="text-lg font-semibold">
                Get Test Requests from Doctor
              </span>
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                {stats?.pending || 0} Pending
              </span>
            </div>
            {isDropdownOpen.requests ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </button>

          {isDropdownOpen.requests && (
            <div className="p-6">
              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
                <div className="flex flex-wrap gap-2">
                  {[
                    "all",
                    "pending",
                    "assigned",
                    "in-progress",
                    "completed",
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
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 w-64"
                  />
                </div>
              </div>

              {/* Requests List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No test requests found</p>
                  </div>
                ) : (
                  filteredRequests.map((request) => (
                    <div
                      key={request._id}
                      className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                        selectedRequest?._id === request._id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-gray-900">
                              {request.test_name}
                            </h3>
                            {getPriorityBadge(request.test_priority)}
                            {getStatusBadge(request.status)}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                            <div>
                              <span className="text-gray-500">Patient:</span>
                              <span className="ml-1 font-medium">
                                {request.patientId?.name}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Doctor:</span>
                              <span className="ml-1 font-medium">
                                {request.doctorId?.name}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Category:</span>
                              <span className="ml-1">
                                {request.test_category}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Date:</span>
                              <span className="ml-1">
                                {new Date(
                                  request.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {request.symptoms && (
                            <p className="text-sm text-gray-600 mt-2">
                              <span className="font-medium">Symptoms:</span>{" "}
                              {request.symptoms}
                            </p>
                          )}
                        </div>

                        {/* Action Buttons based on status */}
                        <div className="ml-4 flex flex-col space-y-2">
                          {request.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleAccept(request._id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-1"
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span>Accept</span>
                              </button>
                              <button
                                onClick={() => handleReject(request._id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-1"
                              >
                                <XCircle className="h-4 w-4" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}
                          {request.status === "assigned" && (
                            <button
                              onClick={() => handleStart(request._id)}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-1"
                            >
                              <FlaskConical className="h-4 w-4" />
                              <span>Start Test</span>
                            </button>
                          )}
                          {request.status === "in-progress" && (
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                document
                                  .getElementById("submit-section")
                                  ?.scrollIntoView({ behavior: "smooth" });
                              }}
                              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center space-x-1"
                            >
                              <Upload className="h-4 w-4" />
                              <span>Submit Results</span>
                            </button>
                          )}
                          {request.status === "completed" && (
                            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg flex items-center space-x-1">
                              <CheckCircle className="h-4 w-4" />
                              <span>Completed</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: Submit Test Report to Doctor */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <button
            onClick={() =>
              setIsDropdownOpen({
                ...isDropdownOpen,
                submit: !isDropdownOpen.submit,
              })
            }
            className="w-full px-6 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white flex items-center justify-between hover:from-teal-600 hover:to-cyan-600 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Upload className="h-6 w-6" />
              <span className="text-lg font-semibold">
                Submit Test Report to Doctor
              </span>
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                {stats?.["in-progress"] || 0} In Progress
              </span>
            </div>
            {isDropdownOpen.submit ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </button>

          {isDropdownOpen.submit && (
            <div id="submit-section" className="p-6">
              {selectedRequest && selectedRequest.status === "in-progress" ? (
                <div>
                  <div className="bg-purple-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Test Details
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Test</p>
                        <p className="font-medium">
                          {selectedRequest.test_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Patient</p>
                        <p className="font-medium">
                          {selectedRequest.patientId?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Doctor</p>
                        <p className="font-medium">
                          {selectedRequest.doctorId?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Priority</p>
                        {getPriorityBadge(selectedRequest.test_priority)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Test Results */}
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

                    {/* Results Summary */}
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

                    {/* Conclusion */}
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

                    {/* Recommendations */}
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

                    {/* MLT Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        MLT Notes
                      </label>
                      <textarea
                        rows={2}
                        value={resultForm.mlt_notes}
                        onChange={(e) =>
                          setResultForm({
                            ...resultForm,
                            mlt_notes: e.target.value,
                          })
                        }
                        placeholder="Any additional notes..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>

                    {/* File Upload */}
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
                        <label
                          htmlFor="report-file"
                          className="cursor-pointer block"
                        >
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
                              <p className="text-gray-600">
                                Click to upload report
                              </p>
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
                          <Loader className="h-5 w-5 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>Submit Report to Doctor</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">
                    {selectedRequest
                      ? `Selected test is ${selectedRequest.status}. Please select an 'In Progress' test to submit results.`
                      : 'Select an "In Progress" test from the list above to submit results.'}
                  </p>
                  {selectedRequest &&
                    selectedRequest.status !== "in-progress" && (
                      <p className="text-sm text-gray-400 mt-2">
                        Status: {selectedRequest.status}
                      </p>
                    )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MLTTestReports;
