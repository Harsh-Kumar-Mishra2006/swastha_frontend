// components/form/AddReportForm.tsx
import React, { useState, useEffect } from "react";
import { useTestReportData } from "../../hooks/useTestReport";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  User,
  Mail,
  Phone,
  Calendar,
  Activity,
  PlusCircle,
  MinusCircle,
  Send,
  Loader2,
  Stethoscope,
  ClipboardList,
  UserCircle,
  Heart,
  Microscope,
  FlaskConical,
  AlertCircle,
  Flag,
} from "lucide-react";
import toast from "react-hot-toast";

interface Test {
  testName: string;
  testDescription: string;
  referenceRange: string;
  unit: string;
}

interface AddReportFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddReportForm: React.FC<AddReportFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const {
    createReport,
    loading,
    getAvailableMLTs,
    availableMLTs,
    assignToMLT,
  } = useTestReportData();
  const [isExpanded, setIsExpanded] = useState(true);
  const [tests, setTests] = useState<Test[]>([
    { testName: "", testDescription: "", referenceRange: "", unit: "" },
  ]);

  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    patientAge: "",
    patientGender: "not_specified" as
      | "male"
      | "female"
      | "other"
      | "not_specified",
    condition: "",
    disease: "",
    reportDescription: "",
    doctorNotes: "",
    additionalNotes: "",
    priority: "normal" as "normal" | "urgent" | "emergency",
    mltId: "", // ADDED: MLT assignment field
  });

  useEffect(() => {
    getAvailableMLTs();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestChange = (
    index: number,
    field: keyof Test,
    value: string,
  ) => {
    const updatedTests = [...tests];
    updatedTests[index][field] = value;
    setTests(updatedTests);
  };

  const addTest = () => {
    setTests([
      ...tests,
      { testName: "", testDescription: "", referenceRange: "", unit: "" },
    ]);
  };

  const removeTest = (index: number) => {
    if (tests.length > 1) {
      const updatedTests = tests.filter((_, i) => i !== index);
      setTests(updatedTests);
    } else {
      toast.error("At least one test is required");
    }
  };

  const validateForm = () => {
    if (!formData.patientName.trim()) {
      toast.error("Please enter patient name");
      return false;
    }
    if (!formData.patientEmail.trim()) {
      toast.error("Please enter patient email");
      return false;
    }
    if (!formData.condition.trim()) {
      toast.error("Please enter condition");
      return false;
    }
    if (!formData.disease.trim()) {
      toast.error("Please enter disease");
      return false;
    }
    if (!formData.reportDescription.trim()) {
      toast.error("Please enter report description");
      return false;
    }
    if (!formData.mltId) {
      toast.error("Please select an MLT to assign this report");
      return false;
    }

    for (let i = 0; i < tests.length; i++) {
      if (!tests[i].testName.trim()) {
        toast.error(`Please enter test name for test ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const reportData = {
        patientName: formData.patientName.trim(),
        patientEmail: formData.patientEmail.trim().toLowerCase(),
        patientPhone: formData.patientPhone.trim(),
        patientAge: formData.patientAge
          ? parseInt(formData.patientAge)
          : undefined,
        patientGender: formData.patientGender,
        condition: formData.condition.trim(),
        disease: formData.disease.trim(),
        reportDescription: formData.reportDescription.trim(),
        doctorNotes: formData.doctorNotes.trim(),
        additionalNotes: formData.additionalNotes.trim(),
        priority: formData.priority,
        tests: tests
          .filter((t) => t.testName.trim())
          .map((t) => ({
            testName: t.testName.trim(),
            testDescription: t.testDescription.trim(),
            referenceRange: t.referenceRange.trim(),
            unit: t.unit.trim(),
          })),
      };

      const result = await createReport(reportData);

      if (result) {
        // If MLT is selected, assign the report
        if (formData.mltId && result.reportId) {
          await assignToMLT(result.reportId, formData.mltId);
        }

        // Reset form
        setFormData({
          patientName: "",
          patientEmail: "",
          patientPhone: "",
          patientAge: "",
          patientGender: "not_specified",
          condition: "",
          disease: "",
          reportDescription: "",
          doctorNotes: "",
          additionalNotes: "",
          priority: "normal",
          mltId: "",
        });
        setTests([
          { testName: "", testDescription: "", referenceRange: "", unit: "" },
        ]);
        setIsExpanded(false);

        if (onSuccess) onSuccess();
        toast.success("Test report created and assigned successfully!");
      }
    } catch (error) {
      console.error("Error creating report:", error);
      toast.error("Failed to create report");
    }
  };

  // Get selected MLT details for display
  const selectedMLT = availableMLTs.find((mlt) => mlt._id === formData.mltId);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div
        className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="bg-teal-100 p-2 rounded-lg">
            <FileText className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Test Report
            </h2>
            <p className="text-sm text-gray-600">
              Add lab test requests for patients
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </div>

      {/* Form */}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="p-6 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <UserCircle className="h-5 w-5 mr-2 text-teal-600" />
                Patient Information
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  name="patientEmail"
                  value={formData.patientEmail}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="patient@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  name="patientPhone"
                  value={formData.patientPhone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="+1234567890"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  name="patientAge"
                  value={formData.patientAge}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="35"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="patientGender"
                value={formData.patientGender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="not_specified">Not Specified</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Medical Information */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Stethoscope className="h-5 w-5 mr-2 text-teal-600" />
                Medical Information
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="e.g., Persistent cough, Fever"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disease <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="disease"
                  value={formData.disease}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="e.g., Respiratory Infection"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="reportDescription"
                value={formData.reportDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Describe the reason for these tests..."
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doctor's Notes
              </label>
              <textarea
                name="doctorNotes"
                value={formData.doctorNotes}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Any specific instructions for the lab technician..."
              />
            </div>

            {/* Tests Section */}
            <div className="md:col-span-2 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Microscope className="h-5 w-5 mr-2 text-teal-600" />
                  Tests Requested
                </h3>
                <button
                  type="button"
                  onClick={addTest}
                  className="flex items-center space-x-1 text-teal-600 hover:text-teal-700 text-sm font-medium"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Test</span>
                </button>
              </div>

              {tests.map((test, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 mb-4 relative"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-700">
                      Test #{index + 1}
                    </h4>
                    {tests.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTest(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <MinusCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Test Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={test.testName}
                        onChange={(e) =>
                          handleTestChange(index, "testName", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        placeholder="e.g., Complete Blood Count"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Unit
                      </label>
                      <input
                        type="text"
                        value={test.unit}
                        onChange={(e) =>
                          handleTestChange(index, "unit", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        placeholder="e.g., K/uL, mg/dL"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Test Description
                      </label>
                      <input
                        type="text"
                        value={test.testDescription}
                        onChange={(e) =>
                          handleTestChange(
                            index,
                            "testDescription",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        placeholder="Brief description of the test"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Reference Range
                      </label>
                      <input
                        type="text"
                        value={test.referenceRange}
                        onChange={(e) =>
                          handleTestChange(
                            index,
                            "referenceRange",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        placeholder="e.g., 4.5-11.0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* MLT Assignment Section - NEW */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FlaskConical className="h-5 w-5 mr-2 text-teal-600" />
                Assign to MLT (Medical Lab Technician)
              </h3>

              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg mb-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-amber-400 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-amber-700">
                      <span className="font-bold">Important:</span> Select an
                      MLT to process these tests. The report will be assigned to
                      them immediately.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select MLT <span className="text-red-500">*</span>
                </label>
                <select
                  name="mltId"
                  value={formData.mltId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Select an MLT --</option>
                  {availableMLTs.map((mlt) => (
                    <option key={mlt._id} value={mlt._id}>
                      {mlt.name} - {mlt.specialization} ({mlt.department})
                    </option>
                  ))}
                </select>
              </div>

              {selectedMLT && (
                <div className="mt-3 p-3 bg-teal-50 rounded-lg">
                  <p className="text-sm text-teal-800 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Report will be sent to:{" "}
                    <strong className="ml-1">{selectedMLT.name}</strong> (
                    {selectedMLT.email})
                  </p>
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <ClipboardList className="h-5 w-5 mr-2 text-teal-600" />
                Additional Information
              </h3>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Any additional information for the lab..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="priority"
                    value="normal"
                    checked={formData.priority === "normal"}
                    onChange={handleChange}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700 flex items-center">
                    <Flag className="h-3 w-3 mr-1 text-gray-500" />
                    Normal
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="priority"
                    value="urgent"
                    checked={formData.priority === "urgent"}
                    onChange={handleChange}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm text-orange-700 flex items-center">
                    <Flag className="h-3 w-3 mr-1 text-orange-500" />
                    Urgent
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="priority"
                    value="emergency"
                    checked={formData.priority === "emergency"}
                    onChange={handleChange}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-red-700 flex items-center">
                    <Flag className="h-3 w-3 mr-1 text-red-500" />
                    Emergency
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex justify-end space-x-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating & Assigning...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Create & Assign Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddReportForm;
