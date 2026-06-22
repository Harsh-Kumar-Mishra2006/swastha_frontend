// pages/patient/PatientPrescriptions.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import prescriptionService from "../../services/prescriptionService";
import { type Prescription } from "../../types/prescription";

const PatientPrescriptions: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State for list
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // State for view
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  // Fetch prescription list
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const response = await prescriptionService.getPatientPrescriptions(
          user.email,
          filter === "all" ? undefined : filter,
        );
        if (response.success) {
          setPrescriptions(response.data);
        } else {
          toast.error(response.error || "Failed to load prescriptions");
        }
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
        toast.error("Failed to load prescriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [filter]);

  // Fetch prescription details when ID changes
  useEffect(() => {
    const fetchPrescriptionDetails = async () => {
      if (!id) {
        setSelectedPrescription(null);
        setViewError(null);
        return;
      }

      try {
        setViewLoading(true);
        setViewError(null);
        const response = await prescriptionService.getPrescriptionDetails(id);
        if (response.success) {
          setSelectedPrescription(response.data);
        } else {
          setViewError(response.error || "Failed to load prescription");
          toast.error("Failed to load prescription");
        }
      } catch (err: any) {
        console.error("Error fetching prescription:", err);
        setViewError(err?.error || "Failed to load prescription");
        toast.error("Failed to load prescription");
      } finally {
        setViewLoading(false);
      }
    };

    fetchPrescriptionDetails();
  }, [id]);

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      dispensed: "bg-blue-100 text-blue-800",
      expired: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return (
      colors[status as keyof typeof colors] || "bg-yellow-100 text-yellow-800"
    );
  };

  const handlePrescriptionClick = (prescriptionId: string) => {
    navigate(`/patient/prescriptions/${prescriptionId}`);
  };

  const handleBackToList = () => {
    navigate("/patient/prescriptions");
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading prescriptions...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - Prescription List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-4 sticky top-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                My Prescriptions
              </h2>
              <div className="flex gap-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="dispensed">Dispensed</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>

            {prescriptions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No prescriptions found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {prescriptions.map((prescription) => (
                  <div
                    key={prescription._id}
                    onClick={() => handlePrescriptionClick(prescription._id)}
                    className={`block border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
                      selectedPrescription?._id === prescription._id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-gray-800 text-sm truncate">
                            {prescription.disease}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                              prescription.prescription_status,
                            )}`}
                          >
                            {prescription.prescription_status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">
                          Dr. {prescription.doctor_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(
                            prescription.prescription_date,
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {prescription.medications.length} medication(s)
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <span className="text-xs text-gray-400">
                          #{prescription._id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - Prescription View */}
        <div className="lg:col-span-2">
          {viewLoading ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-lg">
              <div className="text-gray-500">
                Loading prescription details...
              </div>
            </div>
          ) : viewError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <h2 className="text-xl text-red-600 mb-2">
                Error Loading Prescription
              </h2>
              <p className="text-gray-600">{viewError}</p>
              <button
                onClick={handleBackToList}
                className="mt-4 inline-block text-blue-500 hover:underline"
              >
                Back to Prescriptions
              </button>
            </div>
          ) : selectedPrescription ? (
            <PrescriptionDetails
              prescription={selectedPrescription}
              onBack={handleBackToList}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Select a Prescription
              </h3>
              <p className="text-gray-500">
                Choose a prescription from the list to view its details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// PRESCRIPTION DETAILS COMPONENT
// ============================================
interface PrescriptionDetailsProps {
  prescription: Prescription;
  onBack: () => void;
}

const PrescriptionDetails: React.FC<PrescriptionDetailsProps> = ({
  prescription,
  onBack,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "dispensed":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="text-white hover:text-blue-200 transition-colors"
                title="Back to list"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold">Prescription</h1>
                <p className="text-blue-100 mt-1">
                  #{prescription._id.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
              prescription.prescription_status,
            )}`}
          >
            {prescription.prescription_status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Doctor & Patient Info */}
      <div className="p-6 border-b">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Doctor</h3>
            <p className="font-semibold text-gray-800">
              {prescription.doctor_name}
            </p>
            <p className="text-sm text-gray-600">
              {prescription.doctor_specialization}
            </p>
            <p className="text-sm text-gray-600">{prescription.doctor_email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Patient</h3>
            <p className="font-semibold text-gray-800">
              {prescription.patient_name}
            </p>
            <p className="text-sm text-gray-600">
              {prescription.patient_email}
            </p>
            <p className="text-sm text-gray-600">
              {prescription.patient_phone}
            </p>
            {prescription.patient_age && (
              <p className="text-sm text-gray-600">
                Age: {prescription.patient_age}
              </p>
            )}
            {prescription.patient_bloodGroup && (
              <p className="text-sm text-gray-600">
                Blood Group: {prescription.patient_bloodGroup}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Diagnosis */}
      <div className="p-6 border-b">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Diagnosis</h3>
        <p className="font-semibold text-gray-800">{prescription.diagnosis}</p>
        <p className="text-gray-600">{prescription.disease}</p>
        {prescription.disease_code && (
          <p className="text-sm text-gray-500 mt-1">
            ICD-10: {prescription.disease_code}
          </p>
        )}
      </div>

      {/* Medications */}
      <div className="p-6 border-b">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Medications</h3>
        <div className="space-y-4">
          {prescription.medications.map((med, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {med.medicine_name} {med.strength}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {med.form} • {med.quantity}
                  </p>
                </div>
                {med.is_controlled && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                    Controlled
                  </span>
                )}
              </div>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Dosage:</span>
                  <span className="ml-1 font-medium">{med.dosage}</span>
                </div>
                <div>
                  <span className="text-gray-500">Frequency:</span>
                  <span className="ml-1 font-medium">{med.frequency}</span>
                </div>
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <span className="ml-1 font-medium">{med.duration}</span>
                </div>
                <div>
                  <span className="text-gray-500">Timing:</span>
                  <span className="ml-1 font-medium">{med.timing}</span>
                </div>
              </div>
              {med.special_instructions && (
                <p className="mt-2 text-sm text-blue-600 italic">
                  ℹ️ {med.special_instructions}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <span className="font-medium">Refills:</span>{" "}
          {prescription.refills_remaining} remaining
          {prescription.refills_allowed > 0 &&
            ` out of ${prescription.refills_allowed}`}
        </div>
      </div>

      {/* Patient Instructions */}
      <div className="p-6 border-b">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          Instructions for Patient
        </h3>
        <ul className="list-disc list-inside space-y-1">
          {prescription.patient_instructions.map((instruction, index) => (
            <li key={index} className="text-gray-700">
              {instruction}
            </li>
          ))}
        </ul>
      </div>

      {/* Non-Medical Advice */}
      {prescription.non_medication_advice && (
        <div className="p-6 border-b">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Non-Medical Advice
          </h3>
          <p className="text-gray-700 whitespace-pre-line">
            {prescription.non_medication_advice}
          </p>
        </div>
      )}

      {/* Lifestyle & Dietary */}
      {(prescription.lifestyle_advice || prescription.dietary_restrictions) && (
        <div className="p-6 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prescription.lifestyle_advice && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Lifestyle Advice
                </h3>
                <p className="text-gray-700">{prescription.lifestyle_advice}</p>
              </div>
            )}
            {prescription.dietary_restrictions && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Dietary Restrictions
                </h3>
                <p className="text-gray-700">
                  {prescription.dietary_restrictions}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Warnings */}
      {prescription.warnings && prescription.warnings.length > 0 && (
        <div className="p-6 border-b">
          <h3 className="text-sm font-medium text-red-500 mb-2">
            ⚠️ Warnings & Precautions
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {prescription.warnings.map((warning, index) => (
              <li key={index} className="text-red-600">
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Follow-up */}
      {prescription.follow_up_required && (
        <div className="p-6 border-b bg-yellow-50">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">
            📋 Follow-up Required
          </h3>
          {prescription.follow_up_date && (
            <p className="text-gray-700">
              <span className="font-medium">Date:</span>{" "}
              {new Date(prescription.follow_up_date).toLocaleDateString()}
            </p>
          )}
          {prescription.follow_up_notes && (
            <p className="text-gray-700 mt-1">{prescription.follow_up_notes}</p>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="p-6 bg-gray-50">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <p className="text-sm text-gray-500">
              <span className="font-medium">Prescribed on:</span>{" "}
              {new Date(prescription.prescription_date).toLocaleDateString()}
            </p>
            {prescription.valid_until && (
              <p className="text-sm text-gray-500">
                <span className="font-medium">Valid until:</span>{" "}
                {new Date(prescription.valid_until).toLocaleDateString()}
              </p>
            )}
            {prescription.dispensed_at && (
              <p className="text-sm text-gray-500">
                <span className="font-medium">Dispensed on:</span>{" "}
                {new Date(prescription.dispensed_at).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="text-right">
            {prescription.is_digital_signed && (
              <p className="text-sm text-gray-600">
                ✓ Digitally signed by {prescription.digital_signature}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Prescription ID: {prescription._id}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 border-t flex flex-wrap gap-3">
        <button
          onClick={() => window.print()}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print Prescription
        </button>
        <button
          onClick={onBack}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 transition-colors"
        >
          Back to List
        </button>
        {prescription.prescription_status === "active" && (
          <button
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors ml-auto flex items-center gap-2"
            onClick={() => {
              toast.success("Refill request submitted successfully!");
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Request Refill
          </button>
        )}
      </div>
    </div>
  );
};

export default PatientPrescriptions;
