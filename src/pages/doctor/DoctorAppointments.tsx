// pages/doctor/DoctorAppointments.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import appointmentService from "../../services/appointmentService";
import { type Appointment } from "../../types/appointments";
import {
  Calendar,
  Clock,
  Stethoscope,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Phone,
  Mail,
  DollarSign,
  Search,
  User,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

const DoctorAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [doctorNotes, setDoctorNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [user, filter]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getDoctorAppointments(
        user!.email,
        filter === "all" ? undefined : filter,
      );
      if (response.success) {
        setAppointments(response.data);
        setStats(response.statistics);
        // Keep selected appointment if it still exists in the list
        if (selectedAppointment) {
          const stillExists = response.data.find(
            (a) => a._id === selectedAppointment._id,
          );
          if (stillExists) {
            setSelectedAppointment(stillExists);
          } else {
            // If the selected appointment is no longer in the list, select the first one
            setSelectedAppointment(response.data[0] || null);
          }
        } else if (response.data.length > 0) {
          setSelectedAppointment(response.data[0]);
        }
      }
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (appointmentId: string) => {
    setActionLoading(true);
    try {
      const response = await appointmentService.approveAppointment(
        appointmentId,
        doctorNotes || "Approved",
      );
      if (response.success) {
        toast.success("Appointment approved successfully!");
        // ✅ Option 1: Refresh current filter view
        await loadAppointments();
        setDoctorNotes("");

        // ✅ Option 2: Show notification to view approved
        toast.success(
          <div>
            Appointment approved!
            <button
              onClick={() => setFilter("approved")}
              className="ml-2 underline text-white font-semibold"
            >
              View Approved
            </button>
          </div>,
          { duration: 5000 },
        );
      }
    } catch (error) {
      toast.error("Failed to approve appointment");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (appointmentId: string) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    setActionLoading(true);
    try {
      const response = await appointmentService.rejectAppointment(
        appointmentId,
        rejectionReason,
        doctorNotes || "Rejected",
      );
      if (response.success) {
        toast.success("Appointment rejected");
        await loadAppointments();
        setShowRejectModal(false);
        setRejectionReason("");
        setDoctorNotes("");
      }
    } catch (error) {
      toast.error("Failed to reject appointment");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: ClockIcon },
      approved: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
      cancelled: { color: "bg-gray-100 text-gray-800", icon: XCircle },
      completed: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
    };
    const config = configs[status as keyof typeof configs] || configs.pending;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        <Icon className="h-4 w-4 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredAppointments = appointments.filter(
    (a) =>
      a.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.patient_email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doctor Portal</h1>
            <p className="text-gray-600 mt-1">
              Manage your appointments and patient requests
            </p>
          </div>
          <button
            onClick={loadAppointments}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 flex items-center border border-gray-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              {
                label: "Total",
                value: stats.total,
                color: "bg-blue-50 text-blue-600",
              },
              {
                label: "Pending",
                value: stats.pending,
                color: "bg-yellow-50 text-yellow-600",
              },
              {
                label: "Approved",
                value: stats.approved,
                color: "bg-green-50 text-green-600",
              },
              {
                label: "Rejected",
                value: stats.rejected,
                color: "bg-red-50 text-red-600",
              },
              {
                label: "Completed",
                value: stats.completed,
                color: "bg-purple-50 text-purple-600",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className={`${stat.color} rounded-xl p-4 text-center cursor-pointer hover:opacity-80 transition-opacity`}
                onClick={() => {
                  const filterMap: { [key: string]: string } = {
                    Total: "all",
                    Pending: "pending",
                    Approved: "approved",
                    Rejected: "rejected",
                    Completed: "completed",
                  };
                  setFilter(filterMap[stat.label] || "all");
                }}
              >
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filter and Search */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {["all", "pending", "approved", "rejected", "completed"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === status
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                    {stats && status !== "all" && (
                      <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                        {stats[status] || 0}
                      </span>
                    )}
                  </button>
                ),
              )}
            </div>
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 min-w-[200px]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointment List */}
          <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredAppointments.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">
                  No appointments{" "}
                  {filter !== "all" ? `with status "${filter}"` : ""}
                </p>
                {filter !== "all" && (
                  <button
                    onClick={() => setFilter("all")}
                    className="mt-2 text-sm text-teal-600 hover:text-teal-700"
                  >
                    View all appointments
                  </button>
                )}
              </div>
            ) : (
              filteredAppointments.map((appointment) => (
                <button
                  key={appointment._id}
                  onClick={() => setSelectedAppointment(appointment)}
                  className={`w-full text-left bg-white rounded-xl p-4 shadow-sm transition-all hover:shadow-md ${
                    selectedAppointment?._id === appointment._id
                      ? "ring-2 ring-teal-500 border-transparent"
                      : "border border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-gray-900 truncate">
                          {appointment.patient_name}
                        </p>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex-shrink-0">
                          ID:{" "}
                          {appointment.patientId?._id?.slice(-6) ||
                            appointment.patient_email?.slice(0, 8)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {appointment.patient_email}
                      </p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                        {new Date(
                          appointment.appointment_date,
                        ).toLocaleDateString()}
                        <Clock className="h-3 w-3 ml-2 mr-1 flex-shrink-0" />
                        {appointment.appointment_time}
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      {getStatusBadge(appointment.appointment_status)}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Appointment Details */}
          <div className="lg:col-span-2">
            {selectedAppointment ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                {/* Status Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedAppointment.patient_name}
                    </h2>
                    <p className="text-gray-600">
                      <Mail className="inline h-4 w-4 mr-1" />
                      {selectedAppointment.patient_email}
                      <Phone className="inline h-4 w-4 ml-3 mr-1" />
                      {selectedAppointment.patient_phone}
                    </p>
                    {selectedAppointment.patientId?.profile && (
                      <div className="mt-1 text-xs text-gray-500">
                        {selectedAppointment.patientId.profile.age && (
                          <span>
                            Age: {selectedAppointment.patientId.profile.age}{" "}
                            •{" "}
                          </span>
                        )}
                        {selectedAppointment.patientId.profile.gender && (
                          <span>
                            Gender:{" "}
                            {selectedAppointment.patientId.profile.gender}
                          </span>
                        )}
                        {selectedAppointment.patientId.profile.bloodGroup && (
                          <span className="ml-2">
                            Blood:{" "}
                            {selectedAppointment.patientId.profile.bloodGroup}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  {getStatusBadge(selectedAppointment.appointment_status)}
                </div>

                {/* Patient ID Card */}
                <div className="mb-6 bg-teal-50 rounded-lg p-4 border border-teal-200">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-teal-100 rounded-full">
                      <User className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Patient ID</p>
                      <p className="font-mono font-bold text-teal-700">
                        {selectedAppointment.patientId?._id || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-teal-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">
                        {new Date(
                          selectedAppointment.appointment_date,
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-teal-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium">
                        {selectedAppointment.appointment_time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <DollarSign className="h-5 w-5 text-teal-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Consultation Fee</p>
                      <p className="font-medium">
                        ₹{selectedAppointment.amount}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          selectedAppointment.payment_status === "verified"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedAppointment.payment_status === "verified"
                          ? "Paid"
                          : "Pending"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Stethoscope className="h-5 w-5 text-teal-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Specialization</p>
                      <p className="font-medium">
                        {selectedAppointment.doctor_specialization}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Symptoms */}
                {selectedAppointment.symptoms && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-500">Symptoms / Reason</p>
                    <p className="text-gray-900">
                      {selectedAppointment.symptoms}
                    </p>
                  </div>
                )}

                {/* Notes */}
                {selectedAppointment.notes && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-500">Patient Notes</p>
                    <p className="text-gray-900">{selectedAppointment.notes}</p>
                  </div>
                )}

                {/* Payment Screenshot */}
                {selectedAppointment.screenshot_url && (
                  <div className="border rounded-lg p-4 mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Payment Screenshot
                    </p>
                    <img
                      src={selectedAppointment.screenshot_url}
                      alt="Payment screenshot"
                      className="max-h-48 rounded-lg object-contain"
                    />
                  </div>
                )}

                {/* Actions for Pending Appointments */}
                {selectedAppointment.appointment_status === "pending" && (
                  <div className="mt-6 pt-4 border-t space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Doctor's Notes (Optional)
                      </label>
                      <textarea
                        value={doctorNotes}
                        onChange={(e) => setDoctorNotes(e.target.value)}
                        rows={2}
                        placeholder="Add notes for the patient..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleApprove(selectedAppointment._id)}
                        disabled={actionLoading}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Approve
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setShowRejectModal(true)}
                        disabled={actionLoading}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle className="h-5 w-5 mr-2" />
                        Reject
                      </button>
                    </div>
                  </div>
                )}

                {/* Already Processed */}
                {selectedAppointment.appointment_status !== "pending" && (
                  <div
                    className={`mt-6 pt-4 border-t rounded-lg p-4 ${
                      selectedAppointment.appointment_status === "approved"
                        ? "bg-green-50 border-green-200"
                        : selectedAppointment.appointment_status === "rejected"
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700">Response</p>
                        {selectedAppointment.appointment_status ===
                          "approved" && (
                          <div className="mt-1">
                            <p className="text-green-700">
                              {selectedAppointment.doctor_notes || "Approved"}
                            </p>
                            {selectedAppointment.approval_date && (
                              <p className="text-sm text-gray-500 mt-1">
                                Approved on:{" "}
                                {new Date(
                                  selectedAppointment.approval_date,
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}
                        {selectedAppointment.appointment_status ===
                          "rejected" && (
                          <div className="mt-1">
                            <p className="text-red-700 font-medium">Rejected</p>
                            <p className="text-red-600">
                              {selectedAppointment.rejection_reason ||
                                "No reason provided"}
                            </p>
                          </div>
                        )}
                      </div>
                      {/* View in list button */}
                      <button
                        onClick={() => {
                          const statusMap: { [key: string]: string } = {
                            approved: "approved",
                            rejected: "rejected",
                            completed: "completed",
                            cancelled: "cancelled",
                          };
                          setFilter(
                            statusMap[selectedAppointment.appointment_status] ||
                              "all",
                          );
                        }}
                        className="text-sm text-teal-600 hover:text-teal-700 flex items-center"
                      >
                        View all {selectedAppointment.appointment_status}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center">
                <Stethoscope className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Select an appointment to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Reject Appointment
            </h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting{" "}
              <strong>{selectedAppointment.patient_name}</strong>'s appointment.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                placeholder="e.g., Doctor not available, schedule conflict, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedAppointment._id)}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "Reject Appointment"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
