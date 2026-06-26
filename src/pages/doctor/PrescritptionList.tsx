// pages/doctor/PrescriptionList.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  ClipboardList,
  Pill,
  Search,
  ChevronDown,
  ChevronUp,
  Users,
  FileText,
  Eye,
  Download,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import prescriptionService from "../../services/prescriptionService";
import { type Prescription } from "../../types/prescription";

const PrescriptionList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<
    Prescription[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, _setSortBy] = useState<"date" | "patient">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (user?.email) {
      fetchPrescriptions();
    }
  }, [user]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await prescriptionService.getDoctorPrescriptions(
        user?.email || "",
        filterStatus !== "all" ? filterStatus : undefined,
      );

      if (response.success && response.data) {
        setPrescriptions(response.data);
        setFilteredPrescriptions(response.data);
        if (response.statistics) {
          setStats(response.statistics);
        }
      }
    } catch (error) {
      toast.error("Failed to load prescriptions");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...prescriptions];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.patient_name.toLowerCase().includes(term) ||
          p.diagnosis.toLowerCase().includes(term) ||
          p.disease.toLowerCase().includes(term) ||
          p.medications.some((m) =>
            m.medicine_name.toLowerCase().includes(term),
          ),
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "date") {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        comparison = a.patient_name.localeCompare(b.patient_name);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredPrescriptions(result);
  }, [prescriptions, searchTerm, sortBy, sortOrder]);

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { color: string; icon: any; label: string }> =
      {
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
    const config = configs[status] || configs.active;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const handleViewPrescription = (id: string) => {
    navigate(`/doctor/prescriptions/${id}`);
  };

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
              All Prescriptions
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage all prescriptions you've created
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Doctor:</span>
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
                    onClick={() => {
                      setFilterStatus(status);
                      fetchPrescriptions();
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === status
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ),
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by patient, diagnosis, medicine..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 w-64"
                />
              </div>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {sortOrder === "asc" ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Prescriptions Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {filteredPrescriptions.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No prescriptions found</p>
              <button
                onClick={() => navigate("/view-patients")}
                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Go to Patients
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Diagnosis
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medications
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPrescriptions.map((prescription) => (
                    <tr
                      key={prescription._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="p-2 bg-purple-100 rounded-full">
                            <Users className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {prescription.patient_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {prescription.patient_email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {prescription.diagnosis}
                        </div>
                        <div className="text-xs text-gray-500">
                          {prescription.disease}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <Pill className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {prescription.medications.length} medication(s)
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {prescription.medications
                            .slice(0, 2)
                            .map((m) => m.medicine_name)
                            .join(", ")}
                          {prescription.medications.length > 2 && "..."}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(
                            prescription.createdAt,
                          ).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(
                            prescription.createdAt,
                          ).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(prescription.prescription_status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() =>
                              handleViewPrescription(prescription._id)
                            }
                            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => window.print()}
                            className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title="Print"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 text-sm text-gray-500 text-center">
          Total: {filteredPrescriptions.length} prescriptions
        </div>
      </div>
    </div>
  );
};

export default PrescriptionList;
