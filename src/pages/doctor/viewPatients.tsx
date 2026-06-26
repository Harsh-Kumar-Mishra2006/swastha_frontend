// pages/doctor/ViewPatients.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS IMPORT
import appointmentService from "../../services/appointmentService";
import { type Appointment } from "../../types/appointments";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Stethoscope,
  Search,
  Filter,
  ChevronDown,
  FileText,
  ChevronUp,
  DollarSign,
  Users,
  Activity,
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  Clock as PendingIcon,
  Copy,
  Check,
  IdCard,
} from "lucide-react";
import toast from "react-hot-toast";

interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;
  lastVisit: string;
  firstVisit: string;
  profile?: {
    age?: string;
    gender?: string;
    dob?: string;
    address?: string;
    bloodGroup?: string;
    allergies?: string[];
  };
  appointments: Appointment[];
}

const ViewPatients = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // ✅ ADD THIS HOOK
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [sortBy, setSortBy] = useState<
    "name" | "totalAppointments" | "lastVisit"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadPatientData();
    }
  }, [user]);

  const loadPatientData = async () => {
    try {
      setLoading(true);
      // Get all appointments for the doctor
      const response = await appointmentService.getDoctorAppointments(
        user!.email,
        "all",
      );

      if (response.success) {
        const appointments = response.data;

        // Group appointments by patient
        const patientMap = new Map<string, Patient>();

        appointments.forEach((appointment: Appointment) => {
          const patientId =
            appointment.patientId?._id || appointment.patient_email;

          if (!patientMap.has(patientId)) {
            patientMap.set(patientId, {
              _id: patientId,
              name: appointment.patient_name,
              email: appointment.patient_email,
              phone: appointment.patient_phone,
              totalAppointments: 0,
              completedAppointments: 0,
              pendingAppointments: 0,
              cancelledAppointments: 0,
              lastVisit: appointment.createdAt,
              firstVisit: appointment.createdAt,
              profile: appointment.patientId?.profile || {},
              appointments: [],
            });
          }

          const patient = patientMap.get(patientId)!;
          patient.appointments.push(appointment);
          patient.totalAppointments++;

          // Update status counts
          switch (appointment.appointment_status) {
            case "completed":
              patient.completedAppointments++;
              break;
            case "pending":
            case "approved":
              patient.pendingAppointments++;
              break;
            case "cancelled":
            case "rejected":
              patient.cancelledAppointments++;
              break;
          }

          // Update last visit
          if (new Date(appointment.createdAt) > new Date(patient.lastVisit)) {
            patient.lastVisit = appointment.createdAt;
          }
          // Update first visit
          if (new Date(appointment.createdAt) < new Date(patient.firstVisit)) {
            patient.firstVisit = appointment.createdAt;
          }
        });

        const patientList = Array.from(patientMap.values());
        setPatients(patientList);
        setFilteredPatients(patientList);
      }
    } catch (error) {
      console.error("Error loading patients:", error);
      toast.error("Failed to load patient data");
    } finally {
      setLoading(false);
    }
  };

  // Search and filter patients
  useEffect(() => {
    let result = [...patients];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.email.toLowerCase().includes(term) ||
          p.phone.includes(term) ||
          p._id.toLowerCase().includes(term),
      );
    }

    // Filter by status
    if (filterStatus === "active") {
      result = result.filter((p) => p.totalAppointments > 0);
    } else if (filterStatus === "inactive") {
      result = result.filter((p) => p.totalAppointments === 0);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "totalAppointments":
          comparison = a.totalAppointments - b.totalAppointments;
          break;
        case "lastVisit":
          comparison =
            new Date(a.lastVisit).getTime() - new Date(b.lastVisit).getTime();
          break;
        default:
          comparison = 0;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredPatients(result);
  }, [patients, searchTerm, sortBy, sortOrder, filterStatus]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedId(id);
        toast.success("Patient ID copied to clipboard!");
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch(() => {
        toast.error("Failed to copy ID");
      });
  };

  // ✅ NEW: Handle Add Prescription
  const handleAddPrescription = (patient: Patient) => {
    // Find the latest completed/approved appointment
    const latestAppointment = patient.appointments
      .filter(
        (a) =>
          a.appointment_status === "approved" ||
          a.appointment_status === "completed",
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];

    if (latestAppointment) {
      navigate(`/add-prescription?appointmentId=${latestAppointment._id}`);
    } else {
      toast.error("No approved appointment found for this patient");
    }
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { color: string; icon: any }> = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: PendingIcon },
      approved: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
      cancelled: { color: "bg-gray-100 text-gray-800", icon: XCircle },
      completed: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
    };
    const config = configs[status] || configs.pending;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getActivityStatus = (patient: Patient) => {
    const lastVisit = new Date(patient.lastVisit);
    const now = new Date();
    const daysSinceLastVisit = Math.floor(
      (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysSinceLastVisit <= 7) {
      return { label: "Active", color: "text-green-600 bg-green-50" };
    } else if (daysSinceLastVisit <= 30) {
      return { label: "Recent", color: "text-yellow-600 bg-yellow-50" };
    } else {
      return { label: "Inactive", color: "text-gray-600 bg-gray-50" };
    }
  };

  const formatPatientId = (id: string) => {
    if (!id) return "N/A";
    return id;
  };

  const getShortPatientId = (id: string) => {
    if (!id) return "N/A";
    return id.length > 12 ? `${id.slice(0, 8)}...${id.slice(-4)}` : id;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Patients</h1>
              <p className="text-gray-600 mt-1">
                View and manage all your patients
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={loadPatientData}
                className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 flex items-center border border-gray-200"
              >
                <Users className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Patients",
              value: patients.length,
              icon: Users,
              color: "bg-blue-50 text-blue-600",
            },
            {
              label: "Active Patients",
              value: patients.filter((p) => p.totalAppointments > 0).length,
              icon: Activity,
              color: "bg-green-50 text-green-600",
            },
            {
              label: "Total Appointments",
              value: patients.reduce((acc, p) => acc + p.totalAppointments, 0),
              icon: CalendarIcon,
              color: "bg-purple-50 text-purple-600",
            },
            {
              label: "Completed",
              value: patients.reduce(
                (acc, p) => acc + p.completedAppointments,
                0,
              ),
              icon: CheckCircle,
              color: "bg-teal-50 text-teal-600",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`${stat.color} rounded-xl p-4 text-center`}
            >
              <div className="flex items-center justify-center mb-2">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 min-w-[250px]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="all">All Patients</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="name">Name</option>
                  <option value="totalAppointments">Appointments</option>
                  <option value="lastVisit">Last Visit</option>
                </select>
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

            <div className="text-sm text-gray-500">
              Showing {filteredPatients.length} of {patients.length} patients
            </div>
          </div>
        </div>

        {/* Patient List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Cards */}
          <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredPatients.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No patients found</p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-2 text-sm text-teal-600 hover:text-teal-700"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              filteredPatients.map((patient) => {
                const activity = getActivityStatus(patient);
                return (
                  <button
                    key={patient._id}
                    onClick={() => {
                      setSelectedPatient(patient);
                      setShowPatientDetails(true);
                    }}
                    className={`w-full text-left bg-white rounded-xl p-4 shadow-sm transition-all hover:shadow-md border ${
                      selectedPatient?._id === patient._id && showPatientDetails
                        ? "ring-2 ring-teal-500 border-transparent"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 bg-teal-100 rounded-full">
                            <User className="h-4 w-4 text-teal-600" />
                          </div>
                          <p className="font-semibold text-gray-900 truncate">
                            {patient.name}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 truncate ml-7">
                          {patient.email}
                        </p>
                        {/* Patient ID Display */}
                        <div className="flex items-center mt-1 ml-7 space-x-2">
                          <IdCard className="h-3 w-3 text-gray-400" />
                          <span className="text-xs font-mono text-gray-500">
                            ID: {getShortPatientId(patient._id)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(patient._id, patient._id);
                            }}
                            className="p-0.5 hover:bg-gray-100 rounded"
                          >
                            {copiedId === patient._id ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center mt-1 ml-7 space-x-3 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(patient.lastVisit).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {patient.totalAppointments} visits
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1 ml-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${activity.color}`}
                        >
                          {activity.label}
                        </span>
                        {patient.pendingAppointments > 0 && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                            {patient.pendingAppointments} pending
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Patient Details */}
          <div className="lg:col-span-2">
            {selectedPatient && showPatientDetails ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                {/* Patient Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-teal-100 rounded-full">
                      <User className="h-8 w-8 text-teal-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedPatient.name}
                      </h2>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {selectedPatient.email}
                        </span>
                        <span className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {selectedPatient.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Patient since</div>
                    <div className="font-medium">
                      {new Date(
                        selectedPatient.firstVisit,
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Patient ID Card - Full Display */}
                <div className="mb-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border border-teal-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-teal-100 rounded-full">
                        <IdCard className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Patient ID</p>
                        <div className="flex items-center space-x-2">
                          <p className="font-mono font-bold text-teal-700 text-sm break-all">
                            {formatPatientId(selectedPatient._id)}
                          </p>
                          <button
                            onClick={() =>
                              copyToClipboard(selectedPatient._id, "full-id")
                            }
                            className="p-1 hover:bg-teal-200 rounded transition-colors"
                            title="Copy full ID"
                          >
                            {copiedId === "full-id" ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4 text-teal-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-teal-200 text-teal-800 px-2 py-1 rounded-full">
                        Patient #{selectedPatient._id.slice(-6)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Patient Profile */}
                {selectedPatient.profile && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {selectedPatient.profile.age && (
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-500">Age</p>
                        <p className="font-medium">
                          {selectedPatient.profile.age}
                        </p>
                      </div>
                    )}
                    {selectedPatient.profile.gender && (
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-500">Gender</p>
                        <p className="font-medium">
                          {selectedPatient.profile.gender}
                        </p>
                      </div>
                    )}
                    {selectedPatient.profile.bloodGroup && (
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-500">Blood Group</p>
                        <p className="font-medium">
                          {selectedPatient.profile.bloodGroup}
                        </p>
                      </div>
                    )}
                    {selectedPatient.profile.allergies &&
                      selectedPatient.profile.allergies.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-500">Allergies</p>
                          <p className="font-medium text-xs">
                            {selectedPatient.profile.allergies.join(", ")}
                          </p>
                        </div>
                      )}
                  </div>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedPatient.totalAppointments}
                    </div>
                    <div className="text-xs text-gray-600">Total Visits</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedPatient.completedAppointments}
                    </div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {selectedPatient.pendingAppointments}
                    </div>
                    <div className="text-xs text-gray-600">Pending</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {selectedPatient.cancelledAppointments}
                    </div>
                    <div className="text-xs text-gray-600">Cancelled</div>
                  </div>
                </div>

                {/* Appointment History */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-teal-600" />
                    Appointment History
                  </h3>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {selectedPatient.appointments.length === 0 ? (
                      <p className="text-gray-500 text-sm">No appointments</p>
                    ) : (
                      selectedPatient.appointments
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime(),
                        )
                        .map((appointment) => (
                          <div
                            key={appointment._id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div>
                              <div className="flex items-center space-x-3">
                                <Stethoscope className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">
                                  {appointment.doctor_specialization}
                                </span>
                              </div>
                              <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(
                                    appointment.appointment_date,
                                  ).toLocaleDateString()}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {appointment.appointment_time}
                                </span>
                                <span className="flex items-center">
                                  <DollarSign className="h-3 w-3 mr-1" />₹
                                  {appointment.amount}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              {getStatusBadge(appointment.appointment_status)}
                              <span className="text-xs text-gray-400">
                                {new Date(
                                  appointment.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* ✅ FIXED: Actions Section with Add Prescription Button */}
                <div className="mt-6 pt-4 border-t flex flex-wrap gap-3 justify-end">
                  {/* ✅ FIXED: Add Prescription Button */}
                  <button
                    onClick={() => handleAddPrescription(selectedPatient)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Add Prescription</span>
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={() => setShowPatientDetails(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Select a patient to view detailed information
                </p>
                {patients.length > 0 && (
                  <p className="text-sm text-gray-400 mt-2">
                    Click on any patient card to see their details
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPatients;
