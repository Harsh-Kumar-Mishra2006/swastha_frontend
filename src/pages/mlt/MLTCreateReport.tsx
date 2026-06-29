// pages/mlt/MLTCreateReport.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FileText,
  Microscope,
  User,
  Stethoscope,
  Plus,
  Trash2,
  Upload,
  Download,
  Eye,
  Send,
  AlertCircle,
  CheckCircle,
  Calendar,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import testReportService from "../../services/testReportService";
import {
  type TestReport,
  type TestParameter,
  type NormalRange,
} from "../../types/testReport";

const MLTCreateReport = () => {
  const navigate = useNavigate();
  const { testId } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [testData, setTestData] = useState<TestReport | null>(null);
  const [activeTab, setActiveTab] = useState<
    "basic" | "parameters" | "summary" | "visibility"
  >("basic");

  // Form state
  const [formData, setFormData] = useState({
    test_results: "",
    results_summary: "",
    test_conclusion: "",
    recommendations: "",
    mlt_notes: "",
    report_status: "completed" as "completed" | "in-progress",
    test_parameters: [] as TestParameter[],
    normal_ranges: [] as NormalRange[],
    interpretation: "",
    clinical_impression: "",
    follow_up_instructions: "",
    report_visibility: "both" as "doctor" | "patient" | "both",
    test_report_file: null as File | null,
  });

  // Load test data
  useEffect(() => {
    if (testId) {
      fetchTestData();
    }
  }, [testId]);

  // pages/mlt/MLTCreateReport.tsx - Update the fetchTestData function

  const fetchTestData = async () => {
    try {
      setLoading(true);
      const response = await testReportService.getTestDetails(testId!);
      if (response.success) {
        // ✅ Cast to any to safely access new fields, or use DetailedTestReport
        const data = response.data as any;
        setTestData(data);

        // Pre-fill existing data if any
        if (data.test_results) {
          setFormData((prev) => ({
            ...prev,
            test_results: data.test_results || "",
            results_summary: data.results_summary || "",
            test_conclusion: data.test_conclusion || "",
            recommendations: data.recommendations || "",
            mlt_notes: data.mlt_notes || "",
            // ✅ Safely access new fields with fallback
            test_parameters: data.test_parameters || [],
            normal_ranges: data.normal_ranges || [],
            interpretation: data.interpretation || "",
            clinical_impression: data.clinical_impression || "",
            follow_up_instructions: data.follow_up_instructions || "",
            report_visibility: data.report_visibility || "both",
          }));
        }
      }
    } catch (error) {
      console.error("❌ Error fetching test data:", error);
      toast.error("Failed to load test data");
    } finally {
      setLoading(false);
    }
  };

  // Handle parameter changes
  const handleParameterChange = (
    index: number,
    field: keyof TestParameter,
    value: string,
  ) => {
    const updated = [...formData.test_parameters];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, test_parameters: updated }));
  };

  const addParameter = () => {
    setFormData((prev) => ({
      ...prev,
      test_parameters: [
        ...prev.test_parameters,
        { name: "", value: "", unit: "", normal_range: "", is_abnormal: false },
      ],
    }));
  };

  const removeParameter = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      test_parameters: prev.test_parameters.filter((_, i) => i !== index),
    }));
  };

  // Handle normal range changes
  const handleNormalRangeChange = (
    index: number,
    field: keyof NormalRange,
    value: string,
  ) => {
    const updated = [...formData.normal_ranges];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, normal_ranges: updated }));
  };

  const addNormalRange = () => {
    setFormData((prev) => ({
      ...prev,
      normal_ranges: [
        ...prev.normal_ranges,
        { parameter: "", range: "", description: "" },
      ],
    }));
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload PDF, JPEG, or PNG files only");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setFormData((prev) => ({ ...prev, test_report_file: file }));
      toast.success("File uploaded successfully");
    }
  };

  // Submit report
  const handleSubmit = async () => {
    // Validate
    if (!formData.test_results.trim()) {
      toast.error("Please enter test results");
      return;
    }

    if (!formData.results_summary.trim()) {
      toast.error("Please enter a results summary");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        report_status: formData.report_status,
      };

      const response = await testReportService.createDetailedReport(
        testId!,
        payload,
      );

      if (response.success) {
        toast.success("Test report created successfully!");
        navigate(`/mlt/reports/${response.data._id}`);
      }
    } catch (error: any) {
      console.error("❌ Error submitting report:", error);
      toast.error(error.response?.data?.error || "Failed to create report");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Test Not Found</h2>
          <p className="text-gray-600 mt-2">
            The test you're looking for doesn't exist
          </p>
          <button
            onClick={() => navigate("/mlt/dashboard")}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Microscope className="h-6 w-6 mr-2 text-purple-600" />
                Create Test Report
              </h1>
              <p className="text-gray-600 mt-1">
                Test: {testData.test_name} - {testData.test_category}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  testData.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : testData.status === "in-progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {testData.status.charAt(0).toUpperCase() +
                  testData.status.slice(1)}
              </span>
              <button
                onClick={() => navigate("/mlt/dashboard")}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          </div>
        </div>

        {/* Test Info Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center text-gray-500 text-sm mb-1">
              <User className="h-4 w-4 mr-1" />
              Patient
            </div>
            <p className="font-semibold">{testData.patient_name}</p>
            <p className="text-sm text-gray-600">{testData.patient_email}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center text-gray-500 text-sm mb-1">
              <Stethoscope className="h-4 w-4 mr-1" />
              Doctor
            </div>
            <p className="font-semibold">{testData.doctor_name}</p>
            <p className="text-sm text-gray-600">
              {testData.doctor_specialization}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center text-gray-500 text-sm mb-1">
              <Calendar className="h-4 w-4 mr-1" />
              Created
            </div>
            <p className="font-semibold">
              {new Date(testData.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              {new Date(testData.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap -mb-px">
              {[
                { id: "basic", label: "Basic Info", icon: FileText },
                { id: "parameters", label: "Parameters", icon: Plus },
                {
                  id: "summary",
                  label: "Summary & Conclusion",
                  icon: CheckCircle,
                },
                { id: "visibility", label: "Visibility & Sharing", icon: Eye },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${
                      activeTab === tab.id
                        ? "border-teal-600 text-teal-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-yellow-800">
                        <strong>Test Instructions:</strong>{" "}
                        {testData.test_instructions ||
                          "No specific instructions"}
                      </p>
                      {testData.symptoms && (
                        <p className="text-sm text-yellow-800 mt-1">
                          <strong>Symptoms:</strong> {testData.symptoms}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Results *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.test_results}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        test_results: e.target.value,
                      }))
                    }
                    placeholder="Enter detailed test results..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    MLT Notes
                  </label>
                  <textarea
                    rows={3}
                    value={formData.mlt_notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        mlt_notes: e.target.value,
                      }))
                    }
                    placeholder="Any additional notes from MLT..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attach Report File (PDF/Image)
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer">
                      <div className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload File
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    {formData.test_report_file && (
                      <span className="text-sm text-green-600">
                        ✓ {formData.test_report_file.name}
                      </span>
                    )}
                    {testData?.test_report_url &&
                      !formData.test_report_file && (
                        <a
                          href={testData.test_report_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:text-teal-700 flex items-center text-sm"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          View Existing File
                        </a>
                      )}
                  </div>
                </div>
              </div>
            )}

            {/* Parameters Tab */}
            {activeTab === "parameters" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Test Parameters
                    </h3>
                    <button
                      type="button"
                      onClick={addParameter}
                      className="px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center text-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Parameter
                    </button>
                  </div>
                  {formData.test_parameters.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No parameters added yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {formData.test_parameters.map((param, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <input
                            type="text"
                            placeholder="Parameter name"
                            value={param.name}
                            onChange={(e) =>
                              handleParameterChange(
                                index,
                                "name",
                                e.target.value,
                              )
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                          />
                          <input
                            type="text"
                            placeholder="Value"
                            value={param.value}
                            onChange={(e) =>
                              handleParameterChange(
                                index,
                                "value",
                                e.target.value,
                              )
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                          />
                          <input
                            type="text"
                            placeholder="Unit"
                            value={param.unit}
                            onChange={(e) =>
                              handleParameterChange(
                                index,
                                "unit",
                                e.target.value,
                              )
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                          />
                          <input
                            type="text"
                            placeholder="Normal range"
                            value={param.normal_range}
                            onChange={(e) =>
                              handleParameterChange(
                                index,
                                "normal_range",
                                e.target.value,
                              )
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeParameter(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Normal Ranges
                    </h3>
                    <button
                      type="button"
                      onClick={addNormalRange}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Normal Range
                    </button>
                  </div>
                  {formData.normal_ranges.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No normal ranges added yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {formData.normal_ranges.map((range, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <input
                            type="text"
                            placeholder="Parameter"
                            value={range.parameter}
                            onChange={(e) =>
                              handleNormalRangeChange(
                                index,
                                "parameter",
                                e.target.value,
                              )
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                          />
                          <input
                            type="text"
                            placeholder="Range (e.g., 12-16 g/dL)"
                            value={range.range}
                            onChange={(e) =>
                              handleNormalRangeChange(
                                index,
                                "range",
                                e.target.value,
                              )
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                          />
                          <input
                            type="text"
                            placeholder="Description"
                            value={range.description}
                            onChange={(e) =>
                              handleNormalRangeChange(
                                index,
                                "description",
                                e.target.value,
                              )
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinical Interpretation
                  </label>
                  <textarea
                    rows={3}
                    value={formData.interpretation}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        interpretation: e.target.value,
                      }))
                    }
                    placeholder="Clinical interpretation of results..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
            )}

            {/* Summary Tab */}
            {activeTab === "summary" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Results Summary *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.results_summary}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        results_summary: e.target.value,
                      }))
                    }
                    placeholder="Summarize the key findings..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinical Impression
                  </label>
                  <textarea
                    rows={2}
                    value={formData.clinical_impression}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        clinical_impression: e.target.value,
                      }))
                    }
                    placeholder="Clinical impression based on test results..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Conclusion
                  </label>
                  <textarea
                    rows={2}
                    value={formData.test_conclusion}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        test_conclusion: e.target.value,
                      }))
                    }
                    placeholder="Final conclusion of the test..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recommendations
                  </label>
                  <textarea
                    rows={2}
                    value={formData.recommendations}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        recommendations: e.target.value,
                      }))
                    }
                    placeholder="Recommendations for the patient..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Follow-up Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={formData.follow_up_instructions}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        follow_up_instructions: e.target.value,
                      }))
                    }
                    placeholder="Follow-up instructions for the patient..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
            )}

            {/* Visibility Tab */}
            {activeTab === "visibility" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Report Visibility *
                  </label>
                  <div className="space-y-3">
                    {[
                      {
                        value: "both",
                        label: "Both (Doctor & Patient)",
                        description:
                          "Report will be visible to both doctor and patient",
                      },
                      {
                        value: "doctor",
                        label: "Doctor Only",
                        description:
                          "Report will only be visible to the doctor",
                      },
                      {
                        value: "patient",
                        label: "Patient Only",
                        description:
                          "Report will only be visible to the patient",
                      },
                    ].map((option) => (
                      <label key={option.value} className="block">
                        <div
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                            formData.report_visibility === option.value
                              ? "border-teal-600 bg-teal-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start">
                            <input
                              type="radio"
                              name="report_visibility"
                              value={option.value}
                              checked={
                                formData.report_visibility === option.value
                              }
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  report_visibility: e.target.value as any,
                                }))
                              }
                              className="mt-1 mr-3"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {option.label}
                              </p>
                              <p className="text-sm text-gray-600">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Report Status
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="report_status"
                        value="completed"
                        checked={formData.report_status === "completed"}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            report_status: e.target.value as any,
                          }))
                        }
                        className="mr-2"
                      />
                      <span className="text-green-600 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completed
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="report_status"
                        value="in-progress"
                        checked={formData.report_status === "in-progress"}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            report_status: e.target.value as any,
                          }))
                        }
                        className="mr-2"
                      />
                      <span className="text-yellow-600 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        In Progress
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/mlt/dashboard")}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-lg hover:from-purple-700 hover:to-teal-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Creating Report...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Create Report</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MLTCreateReport;
