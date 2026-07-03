// pages/mlt/MLTCreateReport.tsx - FIXED with console logging

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import testReportService from "../../services/createReportService";
import {
  type TestReport,
  type TestParameter,
  type NormalRange,
  type CreateReportData,
} from "../../types/testReport";
import {
  FileText,
  Upload,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

const CreateReport: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();

  console.log("🚀 CreateReport component mounted");
  console.log("📋 testId from params:", testId);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [testReport, setTestReport] = useState<TestReport | null>(null);
  const [testParameters, setTestParameters] = useState<TestParameter[]>([]);
  const [normalRanges, setNormalRanges] = useState<NormalRange[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    test_results: "",
    results_summary: "",
    test_conclusion: "",
    recommendations: "",
    mlt_notes: "",
    report_status: "completed" as "completed" | "in-progress",
    interpretation: "",
    clinical_impression: "",
    follow_up_instructions: "",
    report_visibility: "both" as "doctor" | "patient" | "both",
  });

  // New parameter form
  const [newParam, setNewParam] = useState<TestParameter>({
    name: "",
    value: "",
    unit: "",
    normal_range: "",
    is_abnormal: false,
  });

  // New normal range form
  const [newRange, setNewRange] = useState<NormalRange>({
    parameter: "",
    range: "",
    description: "",
  });

  useEffect(() => {
    console.log("🔄 useEffect triggered, testId:", testId);
    if (testId) {
      loadTestReport();
    } else {
      console.warn("⚠️ No testId provided in URL params");
      setLoading(false);
      toast.error("No test ID provided");
    }
  }, [testId]);

  const loadTestReport = async () => {
    const startTime = Date.now();
    console.log(
      `⏱️ [${startTime}] Starting loadTestReport for testId:`,
      testId,
    );

    try {
      setLoading(true);
      console.log("⏳ Loading state set to true");

      console.log(`📡 Making API call to getTestReport(${testId})...`);
      const response = await testReportService.getTestReport(testId!);

      const apiDuration = Date.now() - startTime;
      console.log(`✅ API call completed in ${apiDuration}ms`);
      console.log("📦 API Response:", response);

      if (response.success) {
        console.log("✅ Response successful, setting test report data");
        console.log("📋 Test Report Data:", {
          id: response.data._id,
          test_name: response.data.test_name,
          patient_name: response.data.patient_name,
          status: response.data.status,
          hasTestParameters: !!response.data.test_parameters,
          hasNormalRanges: !!response.data.normal_ranges,
        });

        setTestReport(response.data);
        setTestParameters(response.data.test_parameters || []);
        setNormalRanges(response.data.normal_ranges || []);

        // Pre-fill form with existing data
        console.log("📝 Pre-filling form with existing data");
        setFormData({
          test_results: response.data.test_results || "",
          results_summary: response.data.results_summary || "",
          test_conclusion: response.data.test_conclusion || "",
          recommendations: response.data.recommendations || "",
          mlt_notes: response.data.mlt_notes || "",
          report_status:
            response.data.status === "completed" ? "completed" : "in-progress",
          interpretation: response.data.interpretation || "",
          clinical_impression: response.data.clinical_impression || "",
          follow_up_instructions: response.data.follow_up_instructions || "",
          report_visibility: response.data.report_visibility || "both",
        });

        console.log("✅ Form data populated successfully");
      } else {
        console.warn("⚠️ API response was not successful:", response);
        toast.error("Failed to load test report data");
      }
    } catch (error: any) {
      const errorTime = Date.now() - startTime;
      console.error(
        `❌ Error loading test report after ${errorTime}ms:`,
        error,
      );
      console.error("❌ Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack,
      });

      if (error.response?.status === 404) {
        toast.error("Test report not found");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to view this report");
      } else {
        toast.error("Failed to load test report");
      }
    } finally {
      const totalDuration = Date.now() - startTime;
      console.log(`⏱️ loadTestReport completed in ${totalDuration}ms total`);
      setLoading(false);
      console.log("⏳ Loading state set to false");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    console.log(`📝 Input changed: ${name} =`, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("📁 File selected:", file?.name || "No file");

    if (file) {
      setSelectedFile(file);
      // Create preview URL for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          console.log("🖼️ File preview generated");
          setFilePreview(reader.result as string);
        };
        reader.onerror = (error) => {
          console.error("❌ Error reading file:", error);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const addTestParameter = () => {
    console.log("➕ Adding test parameter:", newParam);

    if (!newParam.name || !newParam.value) {
      console.warn("⚠️ Parameter name or value missing");
      toast.error("Parameter name and value are required");
      return;
    }

    setTestParameters((prev) => {
      const updated = [...prev, { ...newParam }];
      console.log("📋 Updated test parameters:", updated);
      return updated;
    });

    setNewParam({
      name: "",
      value: "",
      unit: "",
      normal_range: "",
      is_abnormal: false,
    });
    console.log("🔄 Reset new parameter form");
  };

  const removeTestParameter = (index: number) => {
    console.log(`🗑️ Removing test parameter at index ${index}`);
    setTestParameters((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      console.log("📋 Updated test parameters:", updated);
      return updated;
    });
  };

  const addNormalRange = () => {
    console.log("➕ Adding normal range:", newRange);

    if (!newRange.parameter || !newRange.range) {
      console.warn("⚠️ Parameter or range missing");
      toast.error("Parameter and range are required");
      return;
    }

    setNormalRanges((prev) => {
      const updated = [...prev, { ...newRange }];
      console.log("📋 Updated normal ranges:", updated);
      return updated;
    });

    setNewRange({ parameter: "", range: "", description: "" });
    console.log("🔄 Reset new range form");
  };

  const removeNormalRange = (index: number) => {
    console.log(`🗑️ Removing normal range at index ${index}`);
    setNormalRanges((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      console.log("📋 Updated normal ranges:", updated);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 Form submitted");

    if (!testId) {
      console.error("❌ No testId available");
      toast.error("Invalid test ID");
      return;
    }

    // Validate required fields
    if (!formData.test_results.trim()) {
      console.warn("⚠️ Test results are empty");
      toast.error("Please enter test results");
      return;
    }

    console.log("📝 Form data being submitted:", {
      ...formData,
      test_parameters: testParameters.length,
      normal_ranges: normalRanges.length,
      hasFile: !!selectedFile,
    });

    setSubmitting(true);
    const startTime = Date.now();

    try {
      const submitData: CreateReportData = {
        ...formData,
        test_parameters: testParameters,
        normal_ranges: normalRanges,
        test_report_file: selectedFile || undefined,
      };

      console.log(`📡 Making API call to createDetailedReport(${testId})...`);
      const response = await testReportService.createDetailedReport(
        testId,
        submitData,
      );

      const duration = Date.now() - startTime;
      console.log(`✅ API call completed in ${duration}ms`);
      console.log("📦 Response:", response);

      if (response.success) {
        console.log("✅ Report created successfully!");
        toast.success("Report created successfully!");
        navigate(`/mlt/report/${testId}`);
      } else {
        console.warn("⚠️ Response was not successful:", response);
        toast.error(response.message || "Failed to create report");
      }
    } catch (error: any) {
      const errorTime = Date.now() - startTime;
      console.error(`❌ Error submitting report after ${errorTime}ms:`, error);
      console.error("❌ Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error(error?.response?.data?.error || "Failed to create report");
    } finally {
      setSubmitting(false);
      console.log("⏳ Submitting state set to false");
    }
  };

  // Log when component re-renders
  console.log(
    "🔄 CreateReport rendering, loading:",
    loading,
    "submitting:",
    submitting,
  );

  if (loading) {
    console.log("⏳ Rendering loading spinner");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test report...</p>
          <p className="text-sm text-gray-400 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (!testReport) {
    console.warn("⚠️ Rendering: No test report found");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <p className="text-gray-600">Test report not found</p>
          <button
            onClick={() => navigate("/mlt/dashboard")}
            className="mt-4 text-teal-600 hover:text-teal-700"
          >
            Go back to dashboard
          </button>
        </div>
      </div>
    );
  }

  // Check if test is already completed
  if (testReport.status === "completed") {
    console.log("ℹ️ Report already completed, showing view mode");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Report Already Completed
          </h2>
          <p className="text-gray-600 mb-4">
            This test report has already been completed. You can view it or
            create a new version.
          </p>
          <div className="space-x-3">
            <button
              onClick={() => navigate(`/mlt/report/${testId}`)}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              View Report
            </button>
            <button
              onClick={() => navigate("/mlt/dashboard")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log("✅ Rendering CreateReport form");
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
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
                Create Test Report
              </h1>
              <p className="text-sm text-gray-600">
                {testReport.test_name} - {testReport.patient_name}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/mlt/dashboard")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Test Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Patient</p>
              <p className="font-medium">{testReport.patient_name}</p>
            </div>
            <div>
              <p className="text-gray-500">Doctor</p>
              <p className="font-medium">{testReport.doctor_name}</p>
            </div>
            <div>
              <p className="text-gray-500">Category</p>
              <p className="font-medium">{testReport.test_category}</p>
            </div>
            <div>
              <p className="text-gray-500">Priority</p>
              <p className="font-medium capitalize">
                {testReport.test_priority}
              </p>
            </div>
          </div>
          {testReport.symptoms && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-gray-500 text-sm">Symptoms</p>
              <p className="text-gray-700">{testReport.symptoms}</p>
            </div>
          )}
        </div>

        {/* Rest of the form remains the same... */}
        {/* Report Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Test Results */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Test Results *</h3>
            <textarea
              name="test_results"
              value={formData.test_results}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter detailed test results..."
              required
            />
          </div>

          {/* Results Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Results Summary
            </h3>
            <textarea
              name="results_summary"
              value={formData.results_summary}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              placeholder="Brief summary of results..."
            />
          </div>

          {/* Test Parameters */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Test Parameters
            </h3>

            {/* Add parameter form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
              <input
                type="text"
                placeholder="Parameter name"
                value={newParam.name}
                onChange={(e) =>
                  setNewParam((prev) => ({ ...prev, name: e.target.value }))
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              />
              <input
                type="text"
                placeholder="Value"
                value={newParam.value}
                onChange={(e) =>
                  setNewParam((prev) => ({ ...prev, value: e.target.value }))
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              />
              <input
                type="text"
                placeholder="Unit"
                value={newParam.unit}
                onChange={(e) =>
                  setNewParam((prev) => ({ ...prev, unit: e.target.value }))
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              />
              <input
                type="text"
                placeholder="Normal range"
                value={newParam.normal_range}
                onChange={(e) =>
                  setNewParam((prev) => ({
                    ...prev,
                    normal_range: e.target.value,
                  }))
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <button
              type="button"
              onClick={addTestParameter}
              className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 flex items-center text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Parameter
            </button>

            {/* Parameter list */}
            {testParameters.length > 0 && (
              <div className="mt-4 space-y-2">
                {testParameters.map((param, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="font-medium">{param.name}</span>
                      <span>{param.value}</span>
                      <span className="text-gray-500">{param.unit}</span>
                      <span className="text-sm text-gray-500">
                        Range: {param.normal_range}
                      </span>
                      {param.is_abnormal && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                          Abnormal
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTestParameter(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Normal Ranges */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Normal Ranges</h3>

            {/* Add range form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <input
                type="text"
                placeholder="Parameter"
                value={newRange.parameter}
                onChange={(e) =>
                  setNewRange((prev) => ({
                    ...prev,
                    parameter: e.target.value,
                  }))
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              />
              <input
                type="text"
                placeholder="Range (e.g., 13.5-17.5)"
                value={newRange.range}
                onChange={(e) =>
                  setNewRange((prev) => ({ ...prev, range: e.target.value }))
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              />
              <input
                type="text"
                placeholder="Description"
                value={newRange.description}
                onChange={(e) =>
                  setNewRange((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <button
              type="button"
              onClick={addNormalRange}
              className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 flex items-center text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Normal Range
            </button>

            {/* Normal ranges list */}
            {normalRanges.length > 0 && (
              <div className="mt-4 space-y-2">
                {normalRanges.map((range, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="font-medium">{range.parameter}</span>
                      <span>{range.range}</span>
                      <span className="text-gray-500 text-sm">
                        {range.description}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNormalRange(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interpretation & Impression */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Interpretation
                </h3>
                <textarea
                  name="interpretation"
                  value={formData.interpretation}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Interpretation of results..."
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Clinical Impression
                </h3>
                <textarea
                  name="clinical_impression"
                  value={formData.clinical_impression}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Clinical impression..."
                />
              </div>
            </div>
          </div>

          {/* Conclusion & Recommendations */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Test Conclusion
                </h3>
                <textarea
                  name="test_conclusion"
                  value={formData.test_conclusion}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Final conclusion..."
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Recommendations
                </h3>
                <textarea
                  name="recommendations"
                  value={formData.recommendations}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Recommendations for patient..."
                />
              </div>
            </div>
          </div>

          {/* Follow-up Instructions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Follow-up Instructions
            </h3>
            <textarea
              name="follow_up_instructions"
              value={formData.follow_up_instructions}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              placeholder="Follow-up instructions for patient..."
            />
          </div>

          {/* MLT Notes */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">MLT Notes</h3>
            <textarea
              name="mlt_notes"
              value={formData.mlt_notes}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              placeholder="Internal notes from MLT..."
            />
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Attach Report File
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors">
              <input
                type="file"
                id="report-file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,image/*"
                className="hidden"
              />
              <label
                htmlFor="report-file"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-600">
                  {selectedFile
                    ? selectedFile.name
                    : "Click to upload or drag and drop"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supported: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                </p>
              </label>
              {filePreview && (
                <div className="mt-4">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="max-h-48 rounded-lg mx-auto"
                  />
                </div>
              )}
              {selectedFile && !filePreview && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    File selected: {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Status
                </label>
                <select
                  name="report_status"
                  value={formData.report_status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="in-progress">In Progress (Draft)</option>
                  <option value="completed">Completed (Final)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Visibility
                </label>
                <select
                  name="report_visibility"
                  value={formData.report_visibility}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="doctor">Doctor Only</option>
                  <option value="patient">Patient Only</option>
                  <option value="both">Both Doctor & Patient</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  {testReport?.status === "in-progress"
                    ? "Update Report"
                    : "Submit Report"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReport;
