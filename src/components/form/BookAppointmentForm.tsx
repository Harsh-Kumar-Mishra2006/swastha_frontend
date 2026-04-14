// components/forms/BookAppointmentForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAppointment } from "../../hooks/useAppointments";
import api from "../../services/api";
import {
  FileText,
  Upload,
  Info,
  IndianRupee,
  Video,
  Home,
  X,
  Calendar,
  AlertCircle,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";

interface DoctorInfo {
  _id: string;
  name: string;
  specialization: string;
  consultationFee: number;
  experience?: number;
  qualifications?: string[];
}

const BookAppointmentForm = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { loading, checkAvailability, createPendingAppointment } =
    useAppointment();

  const [doctor, setDoctor] = useState<DoctorInfo | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [checkingSlot, setCheckingSlot] = useState(false);

  // Form states
  const [appointmentDetails, setAppointmentDetails] = useState({
    doctorId: doctorId || "",
    appointmentDate: "",
    appointmentTime: "",
    appointmentType: "visit" as "visit" | "online",
    reasonForVisit: "",
    symptoms: "",
    isFirstVisit: true,
    additionalNotes: "",
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to book an appointment");
      navigate("/login");
      return;
    }

    if (doctorId) {
      fetchDoctorDetails();
    }
  }, [doctorId, isAuthenticated]);

  const fetchDoctorDetails = async () => {
    try {
      const response = await api.get(`/public/doctors/${doctorId}`);
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching doctor:", error);
      toast.error("Failed to load doctor details");
      navigate("/doctors");
    }
  };

  const handleDateChange = async (date: string) => {
    setAppointmentDetails((prev) => ({
      ...prev,
      appointmentDate: date,
      appointmentTime: "",
    }));

    if (doctorId && date) {
      setCheckingSlot(true);
      try {
        // Generate time slots (9 AM to 5 PM, 30 min intervals)
        const slots = [];
        for (let hour = 9; hour < 17; hour++) {
          for (let min = 0; min < 60; min += 30) {
            const timeString = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;

            // Check availability for each slot
            const availabilityCheck = await checkAvailability(
              doctorId,
              date,
              timeString,
            );

            if (availabilityCheck.available) {
              slots.push(timeString);
            }
          }
        }
        setAvailableSlots(slots);

        if (slots.length === 0) {
          toast.error("No slots available for this date");
        }
      } catch (error) {
        console.error("Error fetching slots:", error);
        toast.error("Failed to fetch available slots");
      } finally {
        setCheckingSlot(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitAppointment = async () => {
    // Validate appointment details
    if (!appointmentDetails.appointmentDate) {
      toast.error("Please select appointment date");
      return;
    }
    if (!appointmentDetails.appointmentTime) {
      toast.error("Please select appointment time");
      return;
    }
    if (!appointmentDetails.reasonForVisit.trim()) {
      toast.error("Please provide reason for visit");
      return;
    }

    try {
      const result = await createPendingAppointment({
        doctorId: doctorId!,
        appointmentDate: appointmentDetails.appointmentDate,
        appointmentTime: appointmentDetails.appointmentTime,
        appointmentType: appointmentDetails.appointmentType,
        reasonForVisit: appointmentDetails.reasonForVisit,
        symptoms: appointmentDetails.symptoms
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
        isFirstVisit: appointmentDetails.isFirstVisit,
        additionalNotes: appointmentDetails.additionalNotes,
      });

      if (result) {
        // Navigate to QR payment page
        navigate(`/qr-payment/${result.appointmentId}`, {
          state: {
            appointmentDetails: result,
            doctor: doctor,
            fromBooking: true,
          },
        });
      }
    } catch (error: any) {
      console.error("Error booking appointment:", error);
      if (error.response?.status === 400) {
        if (error.response.data.error?.includes("no longer available")) {
          toast.error(
            "This time slot is no longer available. Please select another slot.",
          );
          // Refresh slots
          if (appointmentDetails.appointmentDate) {
            handleDateChange(appointmentDetails.appointmentDate);
          }
        } else {
          toast.error(
            error.response.data.error || "Failed to book appointment",
          );
        }
      }
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (!doctor) {
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
        {/* Back Button */}
        <button
          onClick={() => navigate(`/doctor/${doctorId}`)}
          className="flex items-center text-gray-600 hover:text-teal-600 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Doctor Profile
        </button>

        {/* Doctor Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-teal-500">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Dr. {doctor.name}
              </h2>
              <p className="text-teal-600">{doctor.specialization}</p>
              {doctor.experience && (
                <p className="text-sm text-gray-500 mt-1">
                  {doctor.experience} years experience
                </p>
              )}
            </div>
            <div className="text-right bg-teal-50 px-4 py-2 rounded-lg">
              <div className="flex items-center text-gray-700">
                <IndianRupee className="h-5 w-5 mr-1 text-teal-600" />
                <span className="font-semibold text-xl">
                  ₹{doctor.consultationFee}
                </span>
              </div>
              <p className="text-xs text-gray-500">Consultation Fee</p>
              <p className="text-xs text-teal-600 font-medium mt-1">
                + ₹{Math.round(doctor.consultationFee * 0.02)} convenience fee
              </p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-teal-600" />
            Book Your Appointment
          </h3>

          <div className="space-y-6">
            {/* Appointment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Appointment Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setAppointmentDetails((prev) => ({
                      ...prev,
                      appointmentType: "visit",
                    }))
                  }
                  className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                    appointmentDetails.appointmentType === "visit"
                      ? "border-teal-600 bg-teal-50 ring-2 ring-teal-200"
                      : "border-gray-200 hover:border-teal-300 hover:bg-gray-50"
                  }`}
                >
                  <Home
                    className={`h-5 w-5 ${
                      appointmentDetails.appointmentType === "visit"
                        ? "text-teal-600"
                        : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      appointmentDetails.appointmentType === "visit"
                        ? "text-teal-600"
                        : "text-gray-700"
                    }`}
                  >
                    Clinic Visit
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setAppointmentDetails((prev) => ({
                      ...prev,
                      appointmentType: "online",
                    }))
                  }
                  className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                    appointmentDetails.appointmentType === "online"
                      ? "border-teal-600 bg-teal-50 ring-2 ring-teal-200"
                      : "border-gray-200 hover:border-teal-300 hover:bg-gray-50"
                  }`}
                >
                  <Video
                    className={`h-5 w-5 ${
                      appointmentDetails.appointmentType === "online"
                        ? "text-teal-600"
                        : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      appointmentDetails.appointmentType === "online"
                        ? "text-teal-600"
                        : "text-gray-700"
                    }`}
                  >
                    Online Consultation
                  </span>
                </button>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                max={
                  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0]
                }
                value={appointmentDetails.appointmentDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
              />
            </div>

            {/* Time Slots */}
            {appointmentDetails.appointmentDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Time Slot <span className="text-red-500">*</span>
                </label>
                {checkingSlot ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                  </div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() =>
                          setAppointmentDetails((prev) => ({
                            ...prev,
                            appointmentTime: slot,
                          }))
                        }
                        className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${
                          appointmentDetails.appointmentTime === slot
                            ? "bg-teal-600 text-white ring-2 ring-teal-300 ring-offset-2"
                            : "bg-gray-100 text-gray-700 hover:bg-teal-100 hover:text-teal-700"
                        }`}
                      >
                        {formatTime(slot)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                    <AlertCircle className="h-5 w-5 text-amber-500 mx-auto mb-2" />
                    <p className="text-amber-700">
                      No slots available for this date
                    </p>
                    <p className="text-xs text-amber-600 mt-1">
                      Please select another date
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Reason for Visit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Visit <span className="text-red-500">*</span>
              </label>
              <textarea
                value={appointmentDetails.reasonForVisit}
                onChange={(e) =>
                  setAppointmentDetails((prev) => ({
                    ...prev,
                    reasonForVisit: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                placeholder="Please describe your symptoms or reason for consultation"
              />
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Symptoms (comma separated)
              </label>
              <input
                type="text"
                value={appointmentDetails.symptoms}
                onChange={(e) =>
                  setAppointmentDetails((prev) => ({
                    ...prev,
                    symptoms: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                placeholder="e.g., fever, headache, cough"
              />
            </div>

            {/* First Visit */}
            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
              <input
                type="checkbox"
                id="firstVisit"
                checked={appointmentDetails.isFirstVisit}
                onChange={(e) =>
                  setAppointmentDetails((prev) => ({
                    ...prev,
                    isFirstVisit: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="firstVisit" className="text-sm text-gray-700">
                This is my first visit to this doctor
              </label>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Previous Reports (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-teal-400 transition-colors">
                <input
                  type="file"
                  id="fileUpload"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="fileUpload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 font-medium">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PDF, JPEG, PNG, GIF (Max 5MB each)
                  </span>
                </label>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Selected Files:
                  </p>
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-teal-600" />
                        <span className="text-sm text-gray-700">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024).toFixed(2)} KB)
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={appointmentDetails.additionalNotes}
                onChange={(e) =>
                  setAppointmentDetails((prev) => ({
                    ...prev,
                    additionalNotes: e.target.value,
                  }))
                }
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                placeholder="Any additional information you'd like to share"
              />
            </div>

            {/* Payment Info */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
              <div className="flex">
                <Info className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700">
                    <span className="font-bold">Payment Required:</span> You'll
                    be redirected to QR payment after booking.
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Total Amount: ₹
                    {doctor.consultationFee +
                      Math.round(doctor.consultationFee * 0.02)}
                    (Consultation: ₹{doctor.consultationFee} + Convenience: ₹
                    {Math.round(doctor.consultationFee * 0.02)})
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    ⚠️ After payment, upload screenshot for verification.
                    Appointment will be confirmed within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmitAppointment}
              disabled={
                loading ||
                !appointmentDetails.appointmentDate ||
                !appointmentDetails.appointmentTime ||
                !appointmentDetails.reasonForVisit.trim()
              }
              className="px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all transform hover:scale-105"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Payment</span>
                  <CreditCard className="h-5 w-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentForm;
