// src/pages/doctor/CreatePrescription.tsx

import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  Plus,
  Trash2,
  Save,
  Calendar,
  User,
  Stethoscope,
  FileText,
  Pill,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader,
  Clock,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import prescriptionService from "../../services/prescriptionService";
import appointmentService from "../../services/appointmentService";
import {
  Medication,
  CreatePrescriptionRequest,
} from "../../types/prescription";
import { Appointment } from "../../types/appointment";

const CreatePrescription: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const appointmentId = new URLSearchParams(location.search).get(
    "appointmentId",
  );

  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loadingAppointment, setLoadingAppointment] = useState(true);

  // Form State
  const [formData, setFormData] = useState<CreatePrescriptionRequest>({
    appointmentId: appointmentId || "",
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentDetails();
    } else {
      toast.error("No appointment selected");
      navigate("/doctor/appointments");
    }
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    try {
      setLoadingAppointment(true);
      const response = await appointmentService.getAppointmentById(
        appointmentId!,
      );
      if (response.success && response.data) {
        setAppointment(response.data);
        // Pre-fill some fields
        setFormData((prev) => ({
          ...prev,
          appointmentId: appointmentId!,
        }));
      } else {
        toast.error("Failed to load appointment details");
      }
    } catch (error) {
      toast.error("Error loading appointment");
    } finally {
      setLoadingAppointment(false);
    }
  };

  // Medication Handlers
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

  const removeMedication = (index: number) => {
    if (formData.medications.length <= 1) {
      toast.error("At least one medication is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const updateMedication = (
    index: number,
    field: keyof Medication,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.map((med, i) =>
        i === index ? { ...med, [field]: value } : med,
      ),
    }));
  };

  // Instruction Handlers
  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      patient_instructions: [...prev.patient_instructions, ""],
    }));
  };

  const removeInstruction = (index: number) => {
    if (formData.patient_instructions.length <= 1) {
      toast.error("At least one instruction is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      patient_instructions: prev.patient_instructions.filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const updateInstruction = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      patient_instructions: prev.patient_instructions.map((inst, i) =>
        i === index ? value : inst,
      ),
    }));
  };

  // Warning Handlers
  const addWarning = () => {
    setFormData((prev) => ({
      ...prev,
      warnings: [...(prev.warnings || []), ""],
    }));
  };

  const removeWarning = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      warnings: prev.warnings?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateWarning = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      warnings:
        prev.warnings?.map((warn, i) => (i === index ? value : warn)) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!formData.diagnosis || !formData.disease) {
      toast.error("Diagnosis and disease are required");
      return;
    }

    const invalidMedication = formData.medications.some(
      (med) =>
        !med.medicine_name ||
        !med.strength ||
        !med.dosage ||
        !med.frequency ||
        !med.duration,
    );
    if (invalidMedication) {
      toast.error("Please fill all medication fields");
      return;
    }

    const invalidInstruction = formData.patient_instructions.some(
      (inst) => !inst.trim(),
    );
    if (invalidInstruction) {
      toast.error("Please fill all instruction fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await prescriptionService.createPrescription({
        ...formData,
        patient_instructions: formData.patient_instructions.filter((inst) =>
          inst.trim(),
        ),
        warnings: formData.warnings?.filter((w) => w.trim()) || [],
        medications: formData.medications.map((med) => ({
          ...med,
          quantity: med.quantity || "As prescribed",
        })),
      });

      if (response.success) {
        toast.success("Prescription created successfully!");
        navigate(`/doctor/prescriptions/${response.data?._id}`);
      } else {
        toast.error(response.error || "Failed to create prescription");
      }
    } catch (error) {
      toast.error("Error creating prescription");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingAppointment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">
            Appointment Not Found
          </h2>
          <p className="text-gray-500 mt-2">
            The appointment you're looking for doesn't exist
          </p>
          <button
            onClick={() => navigate("/doctor/appointments")}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/doctor/appointments")}
                className="p-2 hover:bg-white rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                Create Prescription
              </h1>
            </div>
            <p className="text-gray-600 mt-1">
              Generate a new prescription for your patient
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Doctor:</span>
            <span className="font-medium text-purple-600">{user?.name}</span>
          </div>
        </div>

        {/* Appointment Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-purple-600" />
            Appointment Details
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Patient</p>
              <p className="font-medium">{appointment.patient_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{appointment.patient_email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{appointment.patient_phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date & Time</p>
              <p className="font-medium">
                {new Date(appointment.appointment_date).toLocaleDateString()}
                {" at "}
                {appointment.appointment_time}
              </p>
            </div>
          </div>
          {appointment.symptoms && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">Symptoms</p>
              <p className="text-gray-700">{appointment.symptoms}</p>
            </div>
          )}
        </div>

        {/* Prescription Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6 space-y-6"
        >
          {/* Diagnosis & Disease */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnosis *
              </label>
              <input
                type="text"
                value={formData.diagnosis}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    diagnosis: e.target.value,
                  }))
                }
                placeholder="e.g., Acute Upper Respiratory Tract Infection"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disease *
              </label>
              <input
                type="text"
                value={formData.disease}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, disease: e.target.value }))
                }
                placeholder="e.g., Common Cold"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Disease Code (ICD-10)
            </label>
            <input
              type="text"
              value={formData.disease_code}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  disease_code: e.target.value,
                }))
              }
              placeholder="e.g., J06.9"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Medications Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Pill className="h-5 w-5 mr-2 text-purple-600" />
                Medications
              </h3>
              <button
                type="button"
                onClick={addMedication}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Medication</span>
              </button>
            </div>

            {formData.medications.map((med, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 mb-4 relative"
              >
                <div className="absolute top-2 right-2">
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medicine Name *
                    </label>
                    <input
                      type="text"
                      value={med.medicine_name}
                      onChange={(e) =>
                        updateMedication(index, "medicine_name", e.target.value)
                      }
                      placeholder="e.g., Paracetamol"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Strength *
                    </label>
                    <input
                      type="text"
                      value={med.strength}
                      onChange={(e) =>
                        updateMedication(index, "strength", e.target.value)
                      }
                      placeholder="e.g., 500mg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Form
                    </label>
                    <select
                      value={med.form}
                      onChange={(e) =>
                        updateMedication(index, "form", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
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
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dosage *
                    </label>
                    <input
                      type="text"
                      value={med.dosage}
                      onChange={(e) =>
                        updateMedication(index, "dosage", e.target.value)
                      }
                      placeholder="e.g., 1 tablet"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency *
                    </label>
                    <input
                      type="text"
                      value={med.frequency}
                      onChange={(e) =>
                        updateMedication(index, "frequency", e.target.value)
                      }
                      placeholder="e.g., Twice daily"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration *
                    </label>
                    <input
                      type="text"
                      value={med.duration}
                      onChange={(e) =>
                        updateMedication(index, "duration", e.target.value)
                      }
                      placeholder="e.g., 5 days"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timing
                    </label>
                    <select
                      value={med.timing}
                      onChange={(e) =>
                        updateMedication(index, "timing", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="Before meal">Before meal</option>
                      <option value="After meal">After meal</option>
                      <option value="With meal">With meal</option>
                      <option value="Empty stomach">Empty stomach</option>
                      <option value="Any time">Any time</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Instructions
                    </label>
                    <input
                      type="text"
                      value={med.special_instructions || ""}
                      onChange={(e) =>
                        updateMedication(
                          index,
                          "special_instructions",
                          e.target.value,
                        )
                      }
                      placeholder="e.g., Swallow whole, don't crush"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Patient Instructions */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-purple-600" />
                Patient Instructions
              </h3>
              <button
                type="button"
                onClick={addInstruction}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Instruction</span>
              </button>
            </div>

            {formData.patient_instructions.map((instruction, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={instruction}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  placeholder={`Instruction ${index + 1}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Additional Advice */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Additional Advice
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Non-Medication Advice
                </label>
                <textarea
                  rows={3}
                  value={formData.non_medication_advice}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      non_medication_advice: e.target.value,
                    }))
                  }
                  placeholder="e.g., Drink 2-3 liters of water daily. Get plenty of rest."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lifestyle Advice
                  </label>
                  <textarea
                    rows={2}
                    value={formData.lifestyle_advice}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lifestyle_advice: e.target.value,
                      }))
                    }
                    placeholder="e.g., Regular exercise, stress management"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dietary Restrictions
                  </label>
                  <textarea
                    rows={2}
                    value={formData.dietary_restrictions}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        dietary_restrictions: e.target.value,
                      }))
                    }
                    placeholder="e.g., Avoid spicy food, low salt diet"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Follow-up */}
          <div className="border-t pt-6">
            <div className="flex items-center space-x-4 mb-4">
              <input
                type="checkbox"
                id="follow_up"
                checked={formData.follow_up_required}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    follow_up_required: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
              />
              <label
                htmlFor="follow_up"
                className="text-sm font-medium text-gray-700"
              >
                Follow-up Required
              </label>
            </div>

            {formData.follow_up_required && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={formData.follow_up_date}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        follow_up_date: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Follow-up Notes
                  </label>
                  <input
                    type="text"
                    value={formData.follow_up_notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        follow_up_notes: e.target.value,
                      }))
                    }
                    placeholder="e.g., Check blood pressure"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Warnings & Expiry */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valid Until
                </label>
                <input
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      valid_until: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Refills Allowed
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={formData.refills_allowed}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      refills_allowed: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            {/* Warnings */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Warnings & Precautions
                </label>
                <button
                  type="button"
                  onClick={addWarning}
                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Warning</span>
                </button>
              </div>
              {formData.warnings?.map((warning, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={warning}
                    onChange={(e) => updateWarning(index, e.target.value)}
                    placeholder={`Warning ${index + 1}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeWarning(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doctor's Notes
              </label>
              <textarea
                rows={2}
                value={formData.doctor_notes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    doctor_notes: e.target.value,
                  }))
                }
                placeholder="Any additional notes for the patient or pharmacy"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="border-t pt-6 flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Prescription...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Create Prescription</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/doctor/appointments")}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePrescription;
