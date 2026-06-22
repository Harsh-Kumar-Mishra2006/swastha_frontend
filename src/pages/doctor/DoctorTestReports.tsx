// pages/doctor/DoctorCreateTestRequest.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  User,
  Stethoscope,
  Microscope,
  Activity,
  Heart,
  Pill,
  Send,
  Plus,
  Trash2,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import testReportService from "../../services/testReportService";
import {
  type CreateTestRequestData,
  type Medication,
} from "../../types/testReport";
import MLTSection from "./MLTSection";

const DoctorCreateTestRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [showMLTView, setShowMLTView] = useState(false);

  // Form state - ALL fields are manual input (no dropdowns)
  const [formData, setFormData] = useState<CreateTestRequestData>({
    // Doctor info - auto-filled from logged in user
    doctorId: user?.id || "",
    doctor_name: user?.name || "",
    doctor_email: user?.email || "",
    doctor_specialization: user?.profile?.specialization || "",

    // MLT info - MANUAL INPUT
    mltId: "", // Kept for type compatibility but will be auto-filled if MLT selected
    mlt_name: "",
    mlt_email: "",
    mlt_specialization: "",

    // Patient info - MANUAL INPUT
    patientId: "",
    patient_name: "",
    patient_email: "",
    patient_phone: "",
    patient_age: "",
    patient_gender: "",
    patient_bloodGroup: "",

    // Appointment reference - COMPULSORY
    appointmentId: "",

    // Test details - MANUAL INPUT
    test_name: "",
    test_category: "Hematology",
    test_description: "",
    test_priority: "routine",
    test_instructions: "",

    // Clinical details - MANUAL INPUT
    suspected_disease: "",
    symptoms: "",
    clinical_notes: "",
    medical_history: "",

    // Medications
    medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
  });

  // Set doctor info from logged in user
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        doctorId: user.id || "",
        doctor_name: user.name || "",
        doctor_email: user.email || "",
        doctor_specialization: user.profile?.specialization || "",
      }));
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMedicationChange = (
    index: number,
    field: keyof Medication,
    value: string,
  ) => {
    const updatedMedications = [...formData.medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, medications: updatedMedications }));
  };

  const addMedication = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        { name: "", dosage: "", frequency: "", duration: "" },
      ],
    }));
  };

  const removeMedication = (index: number) => {
    if (formData.medications.length === 1) {
      toast.error("At least one medication field is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  // Function to auto-fill MLT details when selected from the view
  const handleSelectMLT = (mlt: any) => {
    setFormData((prev) => ({
      ...prev,
      mltId: mlt._id || mlt.id || "",
      mlt_name: mlt.name || "",
      mlt_email: mlt.email || "",
      mlt_specialization: mlt.specialization || "",
    }));
    setShowMLTView(false);
    toast.success(`MLT ${mlt.name} selected successfully!`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.mlt_name || !formData.mlt_email) {
      toast.error("Please enter MLT name and email");
      return;
    }
    if (!formData.mlt_specialization) {
      toast.error("Please enter MLT specialization");
      return;
    }
    if (
      !formData.patientId ||
      !formData.patient_name ||
      !formData.patient_email
    ) {
      toast.error("Please enter patient ID, name and email");
      return;
    }
    // APPOINTMENT ID IS NOW COMPULSORY
    if (!formData.appointmentId) {
      toast.error("Please enter Appointment ID (compulsory)");
      return;
    }
    if (!formData.test_name) {
      toast.error("Please enter test name");
      return;
    }
    if (!formData.test_category) {
      toast.error("Please select test category");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        doctorId: user?.id || "",
        doctor_name: user?.name || "",
        doctor_email: user?.email || "",
        doctor_specialization: user?.profile?.specialization || "",
      };

      const response = await testReportService.createTestRequest(payload);
      if (response.success) {
        toast.success("Test request created successfully!");
        navigate("/doctor/test-reports");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Failed to create test request",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create Test Request
            </h1>
            <p className="text-gray-600 mt-1">
              Manually fill all details to request a test from MLT
            </p>
          </div>
          <button
            onClick={() => navigate("/doctor/test-reports")}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>View All Requests</span>
          </button>
        </div>

        {/* Toggle MLT View Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowMLTView(!showMLTView)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2 transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>{showMLTView ? "Hide MLT List" : "View Available MLTs"}</span>
          </button>
          {showMLTView && (
            <p className="text-sm text-gray-600 mt-2">
              Click on any MLT to auto-fill their details in the form below
            </p>
          )}
        </div>

        {/* View MLTs Section - Collapsible */}
        {showMLTView && (
          <div className="mb-8">
            <MLTSection onSelectMLT={handleSelectMLT} />
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6"
        >
          {/* Doctor Info - Auto-filled from logged in user (Read Only) */}
          <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
            <h3 className="font-semibold text-teal-800 mb-3 flex items-center">
              <Stethoscope className="h-5 w-5 mr-2" />
              Doctor Information (Auto-filled)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium text-gray-900">
                  {formData.doctor_name}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium text-gray-900">
                  {formData.doctor_email}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Specialization</p>
                <p className="font-medium text-gray-900">
                  {formData.doctor_specialization || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* MLT Information - MANUAL INPUT with hint */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Microscope className="h-5 w-5 mr-2 text-purple-600" />
              MLT Information (Manual Entry)
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-700">
                <strong>Tip:</strong> Click "View Available MLTs" above to see
                MLT details and auto-fill this section.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MLT Name *
                </label>
                <input
                  type="text"
                  name="mlt_name"
                  value={formData.mlt_name}
                  onChange={handleInputChange}
                  placeholder="Enter MLT full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MLT Email *
                </label>
                <input
                  type="email"
                  name="mlt_email"
                  value={formData.mlt_email}
                  onChange={handleInputChange}
                  placeholder="Enter MLT email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MLT Specialization *
                </label>
                <input
                  type="text"
                  name="mlt_specialization"
                  value={formData.mlt_specialization}
                  onChange={handleInputChange}
                  placeholder="e.g., Hematology, Microbiology"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MLT ID (Auto-filled if selected)
                </label>
                <input
                  type="text"
                  name="mltId"
                  value={formData.mltId}
                  onChange={handleInputChange}
                  placeholder="Auto-filled from MLT selection"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-teal-500 focus:border-teal-500"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Patient Information - MANUAL INPUT */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Patient Information (Manual Entry)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient ID *
                </label>
                <input
                  type="text"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleInputChange}
                  placeholder="Enter patient ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name *
                </label>
                <input
                  type="text"
                  name="patient_name"
                  value={formData.patient_name}
                  onChange={handleInputChange}
                  placeholder="Enter patient full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Email *
                </label>
                <input
                  type="email"
                  name="patient_email"
                  value={formData.patient_email}
                  onChange={handleInputChange}
                  placeholder="Enter patient email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Phone
                </label>
                <input
                  type="text"
                  name="patient_phone"
                  value={formData.patient_phone}
                  onChange={handleInputChange}
                  placeholder="Enter patient phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="text"
                  name="patient_age"
                  value={formData.patient_age}
                  onChange={handleInputChange}
                  placeholder="Enter patient age"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <input
                  type="text"
                  name="patient_gender"
                  value={formData.patient_gender}
                  onChange={handleInputChange}
                  placeholder="Enter gender"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Group
                </label>
                <input
                  type="text"
                  name="patient_bloodGroup"
                  value={formData.patient_bloodGroup}
                  onChange={handleInputChange}
                  placeholder="e.g., A+, B-, O+"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment ID *{" "}
                  <span className="text-red-500">(Required)</span>
                </label>
                <input
                  type="text"
                  name="appointmentId"
                  value={formData.appointmentId}
                  onChange={handleInputChange}
                  placeholder="Enter appointment ID"
                  className="w-full px-4 py-2 border-2 border-red-200 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Appointment ID is required for tracking and verification
                </p>
              </div>
            </div>
          </div>

          {/* Test Details - MANUAL INPUT */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-teal-600" />
              Test Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Name *
                </label>
                <input
                  type="text"
                  name="test_name"
                  value={formData.test_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Complete Blood Count"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Category *
                </label>
                <select
                  name="test_category"
                  value={formData.test_category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="Hematology">Hematology</option>
                  <option value="Microbiology">Microbiology</option>
                  <option value="Biochemistry">Biochemistry</option>
                  <option value="Pathology">Pathology</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Immunology">Immunology</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  name="test_priority"
                  value={formData.test_priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Suspected Disease
                </label>
                <input
                  type="text"
                  name="suspected_disease"
                  value={formData.suspected_disease}
                  onChange={handleInputChange}
                  placeholder="e.g., Anemia, Infection"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Description
              </label>
              <textarea
                name="test_description"
                rows={2}
                value={formData.test_description}
                onChange={handleInputChange}
                placeholder="Describe the test in detail"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Instructions for MLT
              </label>
              <textarea
                name="test_instructions"
                rows={2}
                value={formData.test_instructions}
                onChange={handleInputChange}
                placeholder="Any specific instructions for the MLT"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>

          {/* Clinical Details - MANUAL INPUT */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              Clinical Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Symptoms
              </label>
              <textarea
                name="symptoms"
                rows={2}
                value={formData.symptoms}
                onChange={handleInputChange}
                placeholder="Describe the patient's symptoms"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clinical Notes
              </label>
              <textarea
                name="clinical_notes"
                rows={2}
                value={formData.clinical_notes}
                onChange={handleInputChange}
                placeholder="Additional clinical notes"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medical History
              </label>
              <textarea
                name="medical_history"
                rows={2}
                value={formData.medical_history}
                onChange={handleInputChange}
                placeholder="Patient's medical history"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>

          {/* Medications - MANUAL INPUT */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Pill className="h-5 w-5 mr-2 text-teal-600" />
                Medications
              </h3>
              <button
                type="button"
                onClick={addMedication}
                className="px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center space-x-1 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Medication</span>
              </button>
            </div>

            {formData.medications.map((med, index) => (
              <div
                key={index}
                className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 p-3 bg-gray-50 rounded-lg"
              >
                <input
                  type="text"
                  placeholder="Medication name"
                  value={med.name}
                  onChange={(e) =>
                    handleMedicationChange(index, "name", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
                <input
                  type="text"
                  placeholder="Dosage"
                  value={med.dosage}
                  onChange={(e) =>
                    handleMedicationChange(index, "dosage", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
                <input
                  type="text"
                  placeholder="Frequency"
                  value={med.frequency}
                  onChange={(e) =>
                    handleMedicationChange(index, "frequency", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Duration"
                    value={med.duration}
                    onChange={(e) =>
                      handleMedicationChange(index, "duration", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="border-t pt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/doctor/test-reports")}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Create Test Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorCreateTestRequest;
