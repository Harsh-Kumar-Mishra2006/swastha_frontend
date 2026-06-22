// pages/doctor/AddPrescription.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import prescriptionService from "../../services/prescriptionService";
import appointmentService from "../../services/appointmentService";
import {
  type Medication,
  type CreatePrescriptionRequest,
  type Appointment,
} from "../../types/prescription";

const AddPrescription: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const [patientDetails, setPatientDetails] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState<CreatePrescriptionRequest>({
    appointmentId: "",
    diagnosis: "",
    disease: "",
    disease_code: "",
    medications: [
      {
        medicine_name: "",
        strength: "",
        form: "Tablet",
        quantity: "",
        dosage: "",
        frequency: "",
        duration: "",
        timing: "Any time",
        special_instructions: "",
        is_controlled: false,
      },
    ],
    patient_instructions: [""],
    non_medication_advice: "",
    lifestyle_advice: "",
    dietary_restrictions: "",
    follow_up_required: false,
    follow_up_date: "",
    follow_up_notes: "",
    refills_allowed: 0,
    valid_until: "",
    warnings: [""],
    doctor_notes: "",
  });

  // Fetch doctor's approved appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const response = await appointmentService.getDoctorAppointments(
          user.email,
        );
        if (response.success) {
          const approved = response.data.filter(
            (app: any) => app.appointment_status === "approved",
          );
          setAppointments(approved);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Failed to fetch appointments");
      }
    };
    fetchAppointments();
  }, []);

  // Handle appointment selection
  const handleAppointmentSelect = (appointmentId: string) => {
    const appointment = appointments.find((a: any) => a._id === appointmentId);
    if (appointment) {
      setSelectedAppointment(appointmentId);
      setFormData((prev) => ({
        ...prev,
        appointmentId,
      }));
      setPatientDetails({
        name: appointment.patient_name,
        email: appointment.patient_email,
      });
    }
  };

  // Handle medication changes
  const handleMedicationChange = (
    index: number,
    field: keyof Medication,
    value: any,
  ) => {
    const updatedMedications = [...formData.medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      medications: updatedMedications,
    }));
  };

  // Add medication
  const addMedication = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          medicine_name: "",
          strength: "",
          form: "Tablet",
          quantity: "",
          dosage: "",
          frequency: "",
          duration: "",
          timing: "Any time",
          special_instructions: "",
          is_controlled: false,
        },
      ],
    }));
  };

  // Remove medication
  const removeMedication = (index: number) => {
    if (formData.medications.length > 1) {
      const updated = formData.medications.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        medications: updated,
      }));
    } else {
      toast.error("Must have at least one medication");
    }
  };

  // Handle instructions array
  const handleInstructionChange = (index: number, value: string) => {
    const updated = [...formData.patient_instructions];
    updated[index] = value;
    setFormData((prev) => ({
      ...prev,
      patient_instructions: updated,
    }));
  };

  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      patient_instructions: [...prev.patient_instructions, ""],
    }));
  };

  const removeInstruction = (index: number) => {
    if (formData.patient_instructions.length > 1) {
      const updated = formData.patient_instructions.filter(
        (_, i) => i !== index,
      );
      setFormData((prev) => ({
        ...prev,
        patient_instructions: updated,
      }));
    }
  };

  // Handle warnings array
  const handleWarningChange = (index: number, value: string) => {
    const updated = [...formData.warnings];
    updated[index] = value;
    setFormData((prev) => ({
      ...prev,
      warnings: updated,
    }));
  };

  const addWarning = () => {
    setFormData((prev) => ({
      ...prev,
      warnings: [...prev.warnings, ""],
    }));
  };

  const removeWarning = (index: number) => {
    if (formData.warnings.length > 1) {
      const updated = formData.warnings.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        warnings: updated,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.appointmentId) {
        toast.error("Please select an appointment");
        setLoading(false);
        return;
      }

      if (!formData.diagnosis || !formData.disease) {
        toast.error("Diagnosis and disease are required");
        setLoading(false);
        return;
      }

      // Validate medications
      const hasValidMedication = formData.medications.some(
        (med) => med.medicine_name && med.strength && med.dosage,
      );
      if (!hasValidMedication) {
        toast.error("Please fill in at least one complete medication");
        setLoading(false);
        return;
      }

      // Validate instructions
      const hasValidInstruction = formData.patient_instructions.some((i) =>
        i.trim(),
      );
      if (!hasValidInstruction) {
        toast.error("Please add at least one patient instruction");
        setLoading(false);
        return;
      }

      const response = await prescriptionService.createPrescription(formData);

      if (response.success) {
        toast.success("Prescription created successfully!");
        navigate("/doctor/dashboard");
      } else {
        toast.error(response.error || "Failed to create prescription");
      }
    } catch (error: any) {
      console.error("Error creating prescription:", error);
      toast.error(error?.error || "Failed to create prescription");
    } finally {
      setLoading(false);
    }
  };

  // Medication Forms
  const medicationForm = (medication: Medication, index: number) => (
    <div
      key={index}
      className="medication-card border p-4 rounded-lg mb-4 bg-gray-50"
    >
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold">Medication {index + 1}</h4>
        {index > 0 && (
          <button
            type="button"
            onClick={() => removeMedication(index)}
            className="text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Medicine Name *
          </label>
          <input
            type="text"
            value={medication.medicine_name}
            onChange={(e) =>
              handleMedicationChange(index, "medicine_name", e.target.value)
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="e.g., Paracetamol"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Strength *
          </label>
          <input
            type="text"
            value={medication.strength}
            onChange={(e) =>
              handleMedicationChange(index, "strength", e.target.value)
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="e.g., 500mg, 10mg/5ml"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Form
          </label>
          <select
            value={medication.form}
            onChange={(e) =>
              handleMedicationChange(index, "form", e.target.value)
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="Tablet">Tablet</option>
            <option value="Capsule">Capsule</option>
            <option value="Syrup">Syrup</option>
            <option value="Injection">Injection</option>
            <option value="Cream">Cream</option>
            <option value="Ointment">Ointment</option>
            <option value="Drops">Drops</option>
            <option value="Inhaler">Inhaler</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="text"
            value={medication.quantity}
            onChange={(e) =>
              handleMedicationChange(index, "quantity", e.target.value)
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="e.g., 10 tablets, 1 bottle"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Dosage *
          </label>
          <input
            type="text"
            value={medication.dosage}
            onChange={(e) =>
              handleMedicationChange(index, "dosage", e.target.value)
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="e.g., 1 tablet, 5ml"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Frequency *
          </label>
          <input
            type="text"
            value={medication.frequency}
            onChange={(e) =>
              handleMedicationChange(index, "frequency", e.target.value)
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="e.g., Twice daily, Every 6 hours"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Duration *
          </label>
          <input
            type="text"
            value={medication.duration}
            onChange={(e) =>
              handleMedicationChange(index, "duration", e.target.value)
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="e.g., 5 days, 1 week"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Timing
          </label>
          <select
            value={medication.timing}
            onChange={(e) =>
              handleMedicationChange(index, "timing", e.target.value)
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="Any time">Any time</option>
            <option value="Before meal">Before meal</option>
            <option value="After meal">After meal</option>
            <option value="With meal">With meal</option>
            <option value="Empty stomach">Empty stomach</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Special Instructions
          </label>
          <input
            type="text"
            value={medication.special_instructions}
            onChange={(e) =>
              handleMedicationChange(
                index,
                "special_instructions",
                e.target.value,
              )
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="e.g., Swallow whole, don't crush"
          />
        </div>
        <div className="col-span-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={medication.is_controlled}
              onChange={(e) =>
                handleMedicationChange(index, "is_controlled", e.target.checked)
              }
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Controlled Substance</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Create Prescription
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Appointment Selection */}
          <div className="mb-6 border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Select Appointment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Appointment *
                </label>
                <select
                  value={selectedAppointment}
                  onChange={(e) => handleAppointmentSelect(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  <option value="">Select an appointment</option>
                  {appointments.map((app: any) => (
                    <option key={app._id} value={app._id}>
                      {app.patient_name} -{" "}
                      {new Date(app.appointment_date).toLocaleDateString()} at{" "}
                      {app.appointment_time}
                    </option>
                  ))}
                </select>
              </div>
              {patientDetails && (
                <div className="bg-blue-50 p-3 rounded">
                  <p>
                    <strong>Patient:</strong> {patientDetails.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {patientDetails.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {patientDetails.phone}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Diagnosis */}
          <div className="mb-6 border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Diagnosis & Disease</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Diagnosis *
                </label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) =>
                    setFormData({ ...formData, diagnosis: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="e.g., Acute Upper Respiratory Tract Infection"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Disease *
                </label>
                <input
                  type="text"
                  value={formData.disease}
                  onChange={(e) =>
                    setFormData({ ...formData, disease: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="e.g., Common Cold (Viral)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Disease Code (ICD-10)
                </label>
                <input
                  type="text"
                  value={formData.disease_code}
                  onChange={(e) =>
                    setFormData({ ...formData, disease_code: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="e.g., J00"
                />
              </div>
            </div>
          </div>

          {/* Medications */}
          <div className="mb-6 border-b pb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Medications</h3>
              <button
                type="button"
                onClick={addMedication}
                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
              >
                + Add Medication
              </button>
            </div>
            {formData.medications.map((med, index) =>
              medicationForm(med, index),
            )}
          </div>

          {/* Patient Instructions */}
          <div className="mb-6 border-b pb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">
                Patient Instructions (SIG) *
              </h3>
              <button
                type="button"
                onClick={addInstruction}
                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
              >
                + Add Instruction
              </button>
            </div>
            {formData.patient_instructions.map((instruction, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={instruction}
                  onChange={(e) =>
                    handleInstructionChange(index, e.target.value)
                  }
                  className="flex-1 border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder={`Instruction ${index + 1}`}
                  required
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="text-red-500 hover:text-red-700 px-3"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Non-Medical Advice */}
          <div className="mb-6 border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">
              Non-Medical / Vocal Advice
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  General Advice
                </label>
                <textarea
                  value={formData.non_medication_advice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      non_medication_advice: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows={3}
                  placeholder="e.g., Drink 2-3 liters of water daily. Get plenty of rest..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lifestyle Advice
                </label>
                <textarea
                  value={formData.lifestyle_advice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lifestyle_advice: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows={2}
                  placeholder="e.g., Maintain bed rest for 48 hours. Avoid exposure to cold weather..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dietary Restrictions
                </label>
                <textarea
                  value={formData.dietary_restrictions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dietary_restrictions: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows={2}
                  placeholder="e.g., Avoid cold beverages and spicy food..."
                />
              </div>
            </div>
          </div>

          {/* Follow-up */}
          <div className="mb-6 border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Follow-up</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.follow_up_required}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      follow_up_required: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Follow-up Required
                </label>
              </div>
              {formData.follow_up_required && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Follow-up Date
                    </label>
                    <input
                      type="date"
                      value={formData.follow_up_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          follow_up_date: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Follow-up Notes
                    </label>
                    <textarea
                      value={formData.follow_up_notes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          follow_up_notes: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      rows={2}
                      placeholder="e.g., Patient should visit if symptoms persist after 5 days"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Warnings */}
          <div className="mb-6 border-b pb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Warnings & Precautions</h3>
              <button
                type="button"
                onClick={addWarning}
                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
              >
                + Add Warning
              </button>
            </div>
            {formData.warnings.map((warning, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={warning}
                  onChange={(e) => handleWarningChange(index, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder={`Warning ${index + 1}`}
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeWarning(index)}
                    className="text-red-500 hover:text-red-700 px-3"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Prescription Settings */}
          <div className="mb-6 border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">
              Prescription Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Refills Allowed
                </label>
                <input
                  type="number"
                  value={formData.refills_allowed}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      refills_allowed: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  min="0"
                  max="5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Valid Until
                </label>
                <input
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) =>
                    setFormData({ ...formData, valid_until: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
          </div>

          {/* Doctor Notes */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              Doctor's Notes (Internal)
            </h3>
            <textarea
              value={formData.doctor_notes}
              onChange={(e) =>
                setFormData({ ...formData, doctor_notes: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows={3}
              placeholder="Internal notes for the pharmacy or medical records..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Creating Prescription..." : "Create Prescription"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/doctor/dashboard")}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPrescription;
