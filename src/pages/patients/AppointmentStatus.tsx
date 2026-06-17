// pages/patient/AppointmentStatus.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import appointmentService from "../../services/appointmentService";
import { Appointment } from "../../types/appointment";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  AlertCircle,
  FileText,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
} from "lucide-react";
import toast from "react-hot-toast";

const AppointmentStatus = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(location.state?.appointment || null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [user]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getPatientAppointments(
        user!.email,
      );
      if (response.success) {
        setAppointments(response.data);
        if (!selectedAppointment && response.data.length > 0) {
          setSelectedAppointment(response.data[0]);
        }
      }
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
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

  const getPaymentStatusBadge = (status: string) => {
    if (status === "verified") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Pending
      </span>
    );
  };

  const filteredAppointments = appointments.filter((a) =>
    filter === "all" ? true : a.appointment_status === filter,
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-2"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              My Appointments
            </h1>
            <p className="text-gray-600 mt-1">
              Track and manage your appointments
            </p>
          </div>
          <button
            onClick={() => navigate("/book-appointment")}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Book New
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total",
              value: appointments.length,
              color: "bg-blue-50 text-blue-600",
            },
            {
              label: "Pending",
              value: appointments.filter(
                (a) => a.appointment_status === "pending",
              ).length,
              color: "bg-yellow-50 text-yellow-600",
            },
            {
              label: "Approved",
              value: appointments.filter(
                (a) => a.appointment_status === "approved",
              ).length,
              color: "bg-green-50 text-green-600",
            },
            {
              label: "Completed",
              value: appointments.filter(
                (a) => a.appointment_status === "completed",
              ).length,
              color: "bg-purple-50 text-purple-600",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`${stat.color} rounded-xl p-4 text-center`}
            >
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            "all",
            "pending",
            "approved",
            "rejected",
            "cancelled",
            "completed",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-teal-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointment List */}
          <div className="lg:col-span-1 space-y-3">
            {filteredAppointments.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No appointments found</p>
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
                    <div>
                      <p className="font-semibold text-gray-900">
                        Dr. {appointment.doctor_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {appointment.doctor_specialization}
                      </p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(
                          appointment.appointment_date,
                        ).toLocaleDateString()}
                        <Clock className="h-3 w-3 ml-2 mr-1" />
                        {appointment.appointment_time}
                      </div>
                    </div>
                    <div>{getStatusBadge(appointment.appointment_status)}</div>
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
                      Appointment with Dr. {selectedAppointment.doctor_name}
                    </h2>
                    <p className="text-gray-600">
                      {selectedAppointment.doctor_specialization}
                    </p>
                  </div>
                  {getStatusBadge(selectedAppointment.appointment_status)}
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
                    <User className="h-5 w-5 text-teal-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Patient</p>
                      <p className="font-medium">
                        {selectedAppointment.patient_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedAppointment.patient_email}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedAppointment.patient_phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <DollarSign className="h-5 w-5 text-teal-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Payment</p>
                      <p className="font-medium">
                        ₹{selectedAppointment.amount}
                      </p>
                      {getPaymentStatusBadge(
                        selectedAppointment.payment_status,
                      )}
                    </div>
                  </div>
                </div>

                {/* Symptoms & Notes */}
                {(selectedAppointment.symptoms ||
                  selectedAppointment.notes) && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    {selectedAppointment.symptoms && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-500">
                          Symptoms / Reason
                        </p>
                        <p className="text-gray-900">
                          {selectedAppointment.symptoms}
                        </p>
                      </div>
                    )}
                    {selectedAppointment.notes && (
                      <div>
                        <p className="text-sm text-gray-500">
                          Additional Notes
                        </p>
                        <p className="text-gray-900">
                          {selectedAppointment.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Doctor's Response */}
                {selectedAppointment.appointment_status !== "pending" && (
                  <div
                    className={`rounded-lg p-4 mb-6 ${
                      selectedAppointment.appointment_status === "approved"
                        ? "bg-green-50 border border-green-200"
                        : selectedAppointment.appointment_status === "rejected"
                          ? "bg-red-50 border border-red-200"
                          : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Doctor's Response
                    </p>
                    {selectedAppointment.appointment_status === "approved" ? (
                      <div>
                        <p className="text-green-700">
                          {selectedAppointment.doctor_notes ||
                            "Appointment approved"}
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
                    ) : selectedAppointment.appointment_status ===
                      "rejected" ? (
                      <div>
                        <p className="text-red-700 font-medium">Rejected</p>
                        <p className="text-red-600">
                          {selectedAppointment.rejection_reason ||
                            "No reason provided"}
                        </p>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Payment Screenshot */}
                {selectedAppointment.screenshot_url && (
                  <div className="border rounded-lg p-4">
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

                {/* Actions */}
                {selectedAppointment.appointment_status === "pending" && (
                  <div className="mt-6 pt-4 border-t">
                    <button
                      onClick={async () => {
                        try {
                          await appointmentService.cancelAppointment(
                            selectedAppointment._id,
                            user!.email,
                          );
                          toast.success("Appointment cancelled");
                          loadAppointments();
                        } catch (error) {
                          toast.error("Failed to cancel appointment");
                        }
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Cancel Appointment
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Select an appointment to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentStatus;
