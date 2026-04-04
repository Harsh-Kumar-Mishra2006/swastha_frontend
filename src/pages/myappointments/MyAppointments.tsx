import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppointment } from "../../hooks/useAppointments";
import { Calendar, Clock, IndianRupee, Video, Home } from "lucide-react";
import { format } from "date-fns";

const MyAppointments = () => {
  const navigate = useNavigate();
  const { loading, getMyAppointments, cancelAppointment } = useAppointment();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [_pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await getMyAppointments();
      setAppointments(data.data || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error loading appointments:", error);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await cancelAppointment(appointmentId);
        loadAppointments(); // Refresh list
      } catch (error) {
        console.error("Error cancelling appointment:", error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
      rescheduled: "bg-purple-100 text-purple-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          My Appointments
        </h1>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No Appointments Found
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't booked any appointments yet.
            </p>
            <button
              onClick={() => navigate("/doctors")}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700"
            >
              Browse Doctors
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div
                key={apt.appointmentId}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-900">
                        Dr. {apt.doctorName}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(apt.status)}`}
                      >
                        {apt.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-teal-600" />
                        <span>
                          {format(
                            new Date(apt.appointmentDate),
                            "dd MMMM yyyy",
                          )}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-teal-600" />
                        <span>{apt.appointmentTime.slot}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        {apt.appointmentType === "visit" ? (
                          <Home className="h-4 w-4 mr-2 text-teal-600" />
                        ) : (
                          <Video className="h-4 w-4 mr-2 text-teal-600" />
                        )}
                        <span className="capitalize">
                          {apt.appointmentType}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <IndianRupee className="h-4 w-4 mr-2 text-teal-600" />
                        <span>₹{apt.consultationFee}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 mb-2">
                      <span className="font-medium">Reason:</span>{" "}
                      {apt.reasonForVisit}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0 md:ml-4">
                    <button
                      onClick={() => navigate(`/appointment/${apt._id}`)}
                      className="px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50"
                    >
                      View Details
                    </button>
                    {apt.status === "confirmed" && (
                      <button
                        onClick={() => handleCancel(apt._id)}
                        className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
