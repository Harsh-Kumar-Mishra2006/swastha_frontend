// pages/patient/ViewPrescription.tsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import prescriptionService from "../../services/prescriptionService";
import { type Prescription } from "../../types/prescription";

const ViewPrescription: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        setLoading(true);
        const response = await prescriptionService.getPrescriptionDetails(id!);
        if (response.success) {
          setPrescription(response.data);
        } else {
          setError(response.error || "Failed to load prescription");
        }
      } catch (err: any) {
        console.error("Error fetching prescription:", err);
        setError(err?.error || "Failed to load prescription");
        toast.error("Failed to load prescription");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPrescription();
    }
  }, [id]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading prescription...</div>
      </div>
    );
  }

  if (error || !prescription) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl text-red-600 mb-2">
            Error Loading Prescription
          </h2>
          <p className="text-gray-600">{error || "Prescription not found"}</p>
          <Link
            to="/patient/dashboard"
            className="mt-4 inline-block text-blue-500 hover:underline"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Prescription Header */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">Prescription</h1>
              <p className="text-blue-100 mt-1">
                #{prescription._id.slice(-8).toUpperCase()}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(prescription.prescription_status)}`}
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
              <p className="text-sm text-gray-600">
                {prescription.doctor_email}
              </p>
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
          <p className="font-semibold text-gray-800">
            {prescription.diagnosis}
          </p>
          <p className="text-gray-600">{prescription.disease}</p>
          {prescription.disease_code && (
            <p className="text-sm text-gray-500 mt-1">
              ICD-10: {prescription.disease_code}
            </p>
          )}
        </div>

        {/* Medications */}
        <div className="p-6 border-b">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            Medications
          </h3>
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
        {(prescription.lifestyle_advice ||
          prescription.dietary_restrictions) && (
          <div className="p-6 border-b">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prescription.lifestyle_advice && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Lifestyle Advice
                  </h3>
                  <p className="text-gray-700">
                    {prescription.lifestyle_advice}
                  </p>
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
              <p className="text-gray-700 mt-1">
                {prescription.follow_up_notes}
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-6 bg-gray-50">
          <div className="flex justify-between items-start">
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
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            🖨️ Print Prescription
          </button>
          <Link
            to="/patient/dashboard"
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
          >
            Back to Dashboard
          </Link>
          {prescription.prescription_status === "active" && (
            <button
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 ml-auto"
              onClick={() => {
                // Handle refill request or download PDF
                toast.success("Refill request submitted!");
              }}
            >
              Request Refill
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPrescription;
