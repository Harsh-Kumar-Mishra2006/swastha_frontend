// src/pages/patient/MyPrescriptions.tsx

import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  ClipboardList,
  Pill,
  Calendar,
  Stethoscope,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Search,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import prescriptionService from "../../services/prescriptionService";
import { type Prescription } from "../../types/prescription";

const MyPrescriptions: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (user?.email) {
      fetchPrescriptions();
    }
  }, [user, filter]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await prescriptionService.getPatientPrescriptions(
        user?.email || "",
        filter !== "all" ? filter : undefined,
      );
      if (response.success && response.data) {
        setPrescriptions(response.data);
        if (response.data.length > 0 && !selectedPrescription) {
          setSelectedPrescription(response.data[0]);
        }
        // Calculate stats
        const all = response.data;
        setStats({
          total: all.length,
          active: all.filter((p) => p.prescription_status === "active").length,
          dispensed: all.filter((p) => p.prescription_status === "dispensed")
            .length,
          expired: all.filter((p) => p.prescription_status === "expired")
            .length,
          cancelled: all.filter((p) => p.prescription_status === "cancelled")
            .length,
        });
      }
    } catch (error) {
      toast.error("Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      active: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Active",
      },
      draft: {
        color: "bg-gray-100 text-gray-800",
        icon: Clock,
        label: "Draft",
      },
      dispensed: {
        color: "bg-blue-100 text-blue-800",
        icon: CheckCircle,
        label: "Dispensed",
      },
      expired: {
        color: "bg-red-100 text-red-800",
        icon: AlertCircle,
        label: "Expired",
      },
      cancelled: {
        color: "bg-gray-100 text-gray-800",
        icon: XCircle,
        label: "Cancelled",
      },
    };
    const config = configs[status as keyof typeof configs] || configs.active;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        <Icon className="h-4 w-4 mr-1" />
        {config.label}
      </span>
    );
  };

  const filteredPrescriptions = prescriptions.filter(
    (p) =>
      p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.medications.some((m) =>
        m.medicine_name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Prescriptions
            </h1>
            <p className="text-gray-600 mt-1">
              View all your prescriptions from your doctors
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Patient:</span>
            <span className="font-medium text-purple-600">{user?.name}</span>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              {
                label: "Total",
                value: stats.total,
                color: "bg-blue-50 text-blue-600",
                icon: ClipboardList,
              },
              {
                label: "Active",
                value: stats.active,
                color: "bg-green-50 text-green-600",
                icon: CheckCircle,
              },
              {
                label: "Dispensed",
                value: stats.dispensed,
                color: "bg-purple-50 text-purple-600",
                icon: CheckCircle,
              },
              {
                label: "Expired",
                value: stats.expired,
                color: "bg-red-50 text-red-600",
                icon: AlertCircle,
              },
              {
                label: "Cancelled",
                value: stats.cancelled,
                color: "bg-gray-50 text-gray-600",
                icon: XCircle,
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`${stat.color} rounded-xl p-4 text-center transition-transform hover:scale-105`}
                >
                  <Icon className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {["all", "active", "dispensed", "expired", "cancelled"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === status
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ),
              )}
            </div>
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by diagnosis, doctor, medicine..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 w-64"
              />
            </div>
          </div>
        </div>

        {/* Prescriptions List and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredPrescriptions.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No prescriptions found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Visit a doctor to get a prescription
                </p>
              </div>
            ) : (
              filteredPrescriptions.map((prescription) => (
                <button
                  key={prescription._id}
                  onClick={() => setSelectedPrescription(prescription)}
                  className={`w-full text-left bg-white rounded-xl p-4 shadow-sm transition-all hover:shadow-md ${
                    selectedPrescription?._id === prescription._id
                      ? "ring-2 ring-purple-500 border-transparent"
                      : "border border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {prescription.diagnosis}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        Dr. {prescription.doctor_name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {prescription.medications.length} medication(s)
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(
                          prescription.prescription_date,
                        ).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="ml-2">
                      {getStatusBadge(prescription.prescription_status)}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-2">
            {selectedPrescription ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6 pb-4 border-b">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedPrescription.diagnosis}
                      </h2>
                      {getStatusBadge(selectedPrescription.prescription_status)}
                    </div>
                    <p className="text-gray-600 mt-1">
                      {selectedPrescription.disease}
                    </p>
                    {selectedPrescription.disease_code && (
                      <p className="text-sm text-gray-500">
                        Code: {selectedPrescription.disease_code}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-gray-500">Prescribed on</p>
                    <p className="font-medium">
                      {new Date(
                        selectedPrescription.prescription_date,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="bg-teal-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <Stethoscope className="h-4 w-4 mr-2 text-teal-600" />
                    Doctor Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="font-medium">
                        {selectedPrescription.doctor_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium">
                        {selectedPrescription.doctor_email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Specialization</p>
                      <p className="font-medium">
                        {selectedPrescription.doctor_specialization}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Medications */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <Pill className="h-4 w-4 mr-2 text-blue-600" />
                    Medications ({selectedPrescription.medications.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedPrescription.medications.map((med, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-3 shadow-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {med.medicine_name} {med.strength}
                            </p>
                            <p className="text-sm text-gray-600">
                              {med.dosage} - {med.frequency}
                            </p>
                            <p className="text-sm text-gray-500">
                              Duration: {med.duration} • {med.form}
                              {med.timing && ` • ${med.timing}`}
                            </p>
                          </div>
                          {med.is_controlled && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                              Controlled
                            </span>
                          )}
                        </div>
                        {med.special_instructions && (
                          <p className="text-sm text-gray-500 mt-1 border-t pt-1">
                            {med.special_instructions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Patient Instructions */}
                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-purple-600" />
                    Instructions
                  </h3>
                  <ul className="space-y-1">
                    {selectedPrescription.patient_instructions.map(
                      (instruction, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 flex items-start"
                        >
                          <span className="text-purple-500 mr-2">•</span>
                          {instruction}
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                {/* Additional Advice */}
                {(selectedPrescription.non_medication_advice ||
                  selectedPrescription.lifestyle_advice ||
                  selectedPrescription.dietary_restrictions) && (
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Advice & Recommendations
                    </h3>
                    {selectedPrescription.non_medication_advice && (
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">General: </span>
                        {selectedPrescription.non_medication_advice}
                      </p>
                    )}
                    {selectedPrescription.lifestyle_advice && (
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">Lifestyle: </span>
                        {selectedPrescription.lifestyle_advice}
                      </p>
                    )}
                    {selectedPrescription.dietary_restrictions && (
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Dietary: </span>
                        {selectedPrescription.dietary_restrictions}
                      </p>
                    )}
                  </div>
                )}

                {/* Warnings */}
                {selectedPrescription.warnings &&
                  selectedPrescription.warnings.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Warnings & Precautions
                      </h3>
                      <ul className="space-y-1">
                        {selectedPrescription.warnings.map((warning, index) => (
                          <li
                            key={index}
                            className="text-sm text-yellow-700 flex items-start"
                          >
                            <span className="text-yellow-500 mr-2">⚠</span>
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Follow-up & Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {selectedPrescription.follow_up_required && (
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <h4 className="font-medium text-indigo-800 mb-1">
                        Follow-up Required
                      </h4>
                      {selectedPrescription.follow_up_date && (
                        <p className="text-sm text-indigo-700">
                          Date:{" "}
                          {new Date(
                            selectedPrescription.follow_up_date,
                          ).toLocaleDateString()}
                        </p>
                      )}
                      {selectedPrescription.follow_up_notes && (
                        <p className="text-sm text-indigo-700">
                          Notes: {selectedPrescription.follow_up_notes}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-1">
                      Prescription Details
                    </h4>
                    <p className="text-sm text-gray-600">
                      Refills: {selectedPrescription.refills_remaining} /{" "}
                      {selectedPrescription.refills_allowed}
                    </p>
                    <p className="text-sm text-gray-600">
                      Valid until:{" "}
                      {new Date(
                        selectedPrescription.valid_until,
                      ).toLocaleDateString()}
                    </p>
                    {selectedPrescription.is_digital_signed && (
                      <p className="text-sm text-green-600 flex items-center mt-1">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Digitally signed by Dr.{" "}
                        {selectedPrescription.doctor_name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Doctor Notes */}
                {selectedPrescription.doctor_notes && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-700 mb-1">
                      Doctor's Notes
                    </h4>
                    <p className="text-sm text-gray-600">
                      {selectedPrescription.doctor_notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 pt-4 border-t flex flex-wrap gap-3">
                  <button
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                    onClick={() => window.print()}
                  >
                    <Download className="h-4 w-4" />
                    <span>Print Prescription</span>
                  </button>
                  {selectedPrescription.prescription_status === "active" && (
                    <button
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center space-x-2"
                      onClick={() => toast.success("Request sent to pharmacy!")}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Request Dispensing</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center">
                <ClipboardList className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Select a prescription to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPrescriptions;
