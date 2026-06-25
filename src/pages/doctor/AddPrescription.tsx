// src/pages/doctor/CreatePrescription.tsx

import React, { useState, useEffect, useReducer } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  Plus,
  Trash2,
  Save,
  Calendar,
  FileText,
  Pill,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import prescriptionService from "../../services/prescriptionService";
import appointmentService from "../../services/appointmentService";
import { type CreatePrescriptionRequest } from "../../types/prescription";
import { type Appointment } from "../../types/appointments";

// ✅ Define state type
type FormState = CreatePrescriptionRequest;

// ✅ Define action types
type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: any }
  | { type: "ADD_MEDICATION" }
  | { type: "REMOVE_MEDICATION"; index: number }
  | {
      type: "UPDATE_MEDICATION";
      index: number;
      field: string;
      value: string | boolean;
    }
  | { type: "ADD_INSTRUCTION" }
  | { type: "REMOVE_INSTRUCTION"; index: number }
  | { type: "UPDATE_INSTRUCTION"; index: number; value: string }
  | { type: "ADD_WARNING" }
  | { type: "REMOVE_WARNING"; index: number }
  | { type: "UPDATE_WARNING"; index: number; value: string }
  | { type: "RESET"; payload: FormState };

// ✅ Reducer function
const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };

    case "ADD_MEDICATION":
      return {
        ...state,
        medications: [
          ...state.medications,
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
      };

    case "REMOVE_MEDICATION":
      return {
        ...state,
        medications: state.medications.filter((_, i) => i !== action.index),
      };

    case "UPDATE_MEDICATION": {
      const updatedMedications = [...state.medications];
      updatedMedications[action.index] = {
        ...updatedMedications[action.index],
        [action.field]: action.value,
      };
      return { ...state, medications: updatedMedications };
    }

    case "ADD_INSTRUCTION":
      return {
        ...state,
        patient_instructions: [...state.patient_instructions, ""],
      };

    case "REMOVE_INSTRUCTION":
      return {
        ...state,
        patient_instructions: state.patient_instructions.filter(
          (_, i) => i !== action.index,
        ),
      };

    case "UPDATE_INSTRUCTION": {
      const updatedInstructions = [...state.patient_instructions];
      updatedInstructions[action.index] = action.value;
      return { ...state, patient_instructions: updatedInstructions };
    }

    case "ADD_WARNING":
      return {
        ...state,
        warnings: [...(state.warnings || []), ""],
      };

    case "REMOVE_WARNING":
      return {
        ...state,
        warnings: state.warnings?.filter((_, i) => i !== action.index) || [],
      };

    case "UPDATE_WARNING": {
      const updatedWarnings = [...(state.warnings || [])];
      updatedWarnings[action.index] = action.value;
      return { ...state, warnings: updatedWarnings };
    }

    case "RESET":
      return action.payload;

    default:
      return state;
  }
};

const CreatePrescription: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const appointmentId = new URLSearchParams(location.search).get(
    "appointmentId",
  );

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loadingAppointment, setLoadingAppointment] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Initial state
  const initialState: FormState = {
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
  };

  const [formState, dispatch] = useReducer(formReducer, initialState);

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
      const response = await appointmentService.getAppointmentDetails(
        appointmentId!,
      );
      if (response.success && response.data) {
        setAppointment(response.data);
      } else {
        toast.error("Failed to load appointment details");
      }
    } catch (error) {
      toast.error("Error loading appointment");
      console.error("Fetch error:", error);
    } finally {
      setLoadingAppointment(false);
    }
  };

  // ✅ Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!formState.diagnosis || !formState.disease) {
      toast.error("Diagnosis and disease are required");
      return;
    }

    const invalidMedication = formState.medications.some(
      (med) =>
        !med.medicine_name?.trim() ||
        !med.strength?.trim() ||
        !med.dosage?.trim() ||
        !med.frequency?.trim() ||
        !med.duration?.trim(),
    );
    if (invalidMedication) {
      toast.error("Please fill all medication fields");
      return;
    }

    const invalidInstruction = formState.patient_instructions.some(
      (inst) => !inst?.trim(),
    );
    if (invalidInstruction) {
      toast.error("Please fill all instruction fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formState,
        patient_instructions: formState.patient_instructions.filter((inst) =>
          inst.trim(),
        ),
        warnings: formState.warnings?.filter((w) => w.trim()) || [],
        medications: formState.medications.map((med) => ({
          ...med,
          quantity: med.quantity || "As prescribed",
          medicine_name: med.medicine_name.trim(),
          strength: med.strength.trim(),
          dosage: med.dosage.trim(),
          frequency: med.frequency.trim(),
          duration: med.duration.trim(),
        })),
      };

      const response = await prescriptionService.createPrescription(payload);

      if (response.success) {
        toast.success("Prescription created successfully!");
        navigate(`/doctor/prescriptions/${response.data?._id}`);
      } else {
        toast.error(response.error || "Failed to create prescription");
      }
    } catch (error) {
      toast.error("Error creating prescription");
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loadingAppointment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Not found state
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
                value={formState.diagnosis}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "diagnosis",
                    value: e.target.value,
                  })
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
                value={formState.disease}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "disease",
                    value: e.target.value,
                  })
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
              value={formState.disease_code}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "disease_code",
                  value: e.target.value,
                })
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
                onClick={() => dispatch({ type: "ADD_MEDICATION" })}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Medication</span>
              </button>
            </div>

            {formState.medications.map((med, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 mb-4 relative"
              >
                <button
                  type="button"
                  onClick={() => dispatch({ type: "REMOVE_MEDICATION", index })}
                  className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  disabled={formState.medications.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medicine Name *
                    </label>
                    <input
                      type="text"
                      value={med.medicine_name}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_MEDICATION",
                          index,
                          field: "medicine_name",
                          value: e.target.value,
                        })
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
                        dispatch({
                          type: "UPDATE_MEDICATION",
                          index,
                          field: "strength",
                          value: e.target.value,
                        })
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
                        dispatch({
                          type: "UPDATE_MEDICATION",
                          index,
                          field: "form",
                          value: e.target.value,
                        })
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
                        dispatch({
                          type: "UPDATE_MEDICATION",
                          index,
                          field: "dosage",
                          value: e.target.value,
                        })
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
                        dispatch({
                          type: "UPDATE_MEDICATION",
                          index,
                          field: "frequency",
                          value: e.target.value,
                        })
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
                        dispatch({
                          type: "UPDATE_MEDICATION",
                          index,
                          field: "duration",
                          value: e.target.value,
                        })
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
                        dispatch({
                          type: "UPDATE_MEDICATION",
                          index,
                          field: "timing",
                          value: e.target.value,
                        })
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
                        dispatch({
                          type: "UPDATE_MEDICATION",
                          index,
                          field: "special_instructions",
                          value: e.target.value,
                        })
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
                onClick={() => dispatch({ type: "ADD_INSTRUCTION" })}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Instruction</span>
              </button>
            </div>

            {formState.patient_instructions.map((instruction, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={instruction}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_INSTRUCTION",
                      index,
                      value: e.target.value,
                    })
                  }
                  placeholder={`Instruction ${index + 1}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    dispatch({ type: "REMOVE_INSTRUCTION", index })
                  }
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={formState.patient_instructions.length <= 1}
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
                  value={formState.non_medication_advice}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "non_medication_advice",
                      value: e.target.value,
                    })
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
                    value={formState.lifestyle_advice}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "lifestyle_advice",
                        value: e.target.value,
                      })
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
                    value={formState.dietary_restrictions}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "dietary_restrictions",
                        value: e.target.value,
                      })
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
                checked={formState.follow_up_required}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "follow_up_required",
                    value: e.target.checked,
                  })
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

            {formState.follow_up_required && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={formState.follow_up_date}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "follow_up_date",
                        value: e.target.value,
                      })
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
                    value={formState.follow_up_notes}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "follow_up_notes",
                        value: e.target.value,
                      })
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
                  value={formState.valid_until}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "valid_until",
                      value: e.target.value,
                    })
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
                  value={formState.refills_allowed}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "refills_allowed",
                      value: parseInt(e.target.value) || 0,
                    })
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
                  onClick={() => dispatch({ type: "ADD_WARNING" })}
                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Warning</span>
                </button>
              </div>
              {formState.warnings?.map((warning, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={warning}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_WARNING",
                        index,
                        value: e.target.value,
                      })
                    }
                    placeholder={`Warning ${index + 1}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "REMOVE_WARNING", index })}
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
                value={formState.doctor_notes}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "doctor_notes",
                    value: e.target.value,
                  })
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
