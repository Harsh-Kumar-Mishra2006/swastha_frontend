// components/patient/PatientPrescriptions.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import prescriptionService from "../../services/prescriptionService";
import { type Prescription } from "../../types/prescription";

const PatientPrescriptions: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="text-gray-500">Loading prescriptions...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">My Prescriptions</h2>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
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
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <Link
              key={prescription._id}
              to={`/patient/prescription/${prescription._id}`}
              className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-gray-800">
                      {prescription.disease}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(prescription.prescription_status)}`}
                    >
                      {prescription.prescription_status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Dr. {prescription.doctor_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(
                      prescription.prescription_date,
                    ).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {prescription.medications.length} medication(s)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-400">
                    #{prescription._id.slice(-6).toUpperCase()}
                  </span>
                  {prescription.medication_count && (
                    <p className="text-xs text-gray-500">
                      {prescription.medication_count} items
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientPrescriptions;
