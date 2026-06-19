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
  Plus,
  Trash2,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";
import testReportService from "../../services/testReportService";
import {
  type CreateTestRequestData,
  type Medication,
} from "../../types/testReport";

const DoctorCreateTestRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [_loading, _setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mlts, setMlts] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);

  // Form state - all fields manual input
  const [formData, setFormData] = useState<CreateTestRequestData>({
    doctorId: user?.id || "",
    doctor_name: user?.name || "",
    doctor_email: user?.email || "",
    doctor_specialization: user?.profile?.specialization || "",
    mltId: "",
    mlt_name: "",
    mlt_email: "",
    mlt_specialization: "",
    patientId: "",
    patient_name: "",
    patient_email: "",
    patient_phone: "",
    patient_age: "",
    patient_gender: "",
    patient_bloodGroup: "",
    appointmentId: "",
    test_name: "",
    test_category: "Hematology",
    test_description: "",
    test_priority: "routine",
    test_instructions: "",
    suspected_disease: "",
    symptoms: "",
    clinical_notes: "",
    medical_history: "",
    medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
  });

  // Load doctor data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        doctorId: user.id || "",
        doctor_name: user.name || "",
        doctor_email: user.email || "",
        doctor_specialization: user.profile?.specialization || "",
      }));
      fetchMLTs();
      fetchPatients();
    }
  }, [user]);

  const fetchMLTs = async () => {
    try {
      const response = await testReportService.getMLTs();
      if (response.success) {
        setMlts(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch MLTs:", error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await testReportService.getPatientsForDoctor(
        user?.id || "",
      );
      if (response.success) {
        setPatients(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  };

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

  // Handle MLT selection from dropdown (populates MLT fields)
  const handleMLTSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mltId = e.target.value;
    const selectedMLT = mlts.find((m) => m._id === mltId);
    if (selectedMLT) {
      setFormData((prev) => ({
        ...prev,
        mltId: selectedMLT._id,
        mlt_name: selectedMLT.name,
        mlt_email: selectedMLT.email,
        mlt_specialization: selectedMLT.specialization,
      }));
    }
  };

  // Handle Patient selection from dropdown (populates patient fields)
  const handlePatientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const patientId = e.target.value;
    const selectedPatient = patients.find((p) => p._id === patientId);
    if (selectedPatient) {
      setFormData((prev) => ({
        ...prev,
        patientId: selectedPatient._id,
        patient_name: selectedPatient.name,
        patient_email: selectedPatient.email,
        patient_phone: selectedPatient.phone || "",
        patient_age: selectedPatient.profile?.age || "",
        patient_gender: selectedPatient.profile?.gender || "",
        patient_bloodGroup: selectedPatient.profile?.bloodGroup || "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.mltId || !formData.mlt_name) {
      toast.error("Please select an MLT");
      return;
    }
    if (!formData.patientId || !formData.patient_name) {
      toast.error("Please select a patient");
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
              Fill in the details to request a test from MLT
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

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6"
        >
          {/* Doctor Info - Read Only */}
          <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
            <h3 className="font-semibold text-teal-800 mb-3 flex items-center">
              <Stethoscope className="h-5 w-5 mr-2" />
              Doctor Information
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

          {/* Select MLT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select MLT *
            </label>
            <select
              value={formData.mltId}
              onChange={handleMLTSelect}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">Select MLT</option>
              {mlts.map((mlt) => (
                <option key={mlt._id} value={mlt._id}>
                  {mlt.name} - {mlt.specialization} ({mlt.department})
                </option>
              ))}
            </select>
          </div>

          {/* MLT Details - Auto populated */}
          {formData.mltId && (
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
                <Microscope className="h-5 w-5 mr-2" />
                MLT Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">
                    {formData.mlt_name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">
                    {formData.mlt_email}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Specialization</p>
                  <p className="font-medium text-gray-900">
                    {formData.mlt_specialization}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Select Patient */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Patient *
            </label>
            <select
              value={formData.patientId}
              onChange={handlePatientSelect}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.name} - {patient.email}
                </option>
              ))}
            </select>
          </div>

          {/* Patient Details - Auto populated */}
          {formData.patientId && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Patient Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">
                    {formData.patient_name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">
                    {formData.patient_email}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">
                    {formData.patient_phone || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Age/Gender/Blood</p>
                  <p className="font-medium text-gray-900">
                    {formData.patient_age || "N/A"} /{" "}
                    {formData.patient_gender || "N/A"} /{" "}
                    {formData.patient_bloodGroup || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Test Details */}
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
                  placeholder="e.g., Anemia"
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

          {/* Clinical Details */}
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

          {/* Medications */}
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
                <span>Add</span>
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
