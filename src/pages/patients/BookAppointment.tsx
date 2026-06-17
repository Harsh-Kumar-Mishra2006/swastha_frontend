// pages/patients/BookAppointment.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import appointmentService from "../../services/appointmentService";
import {
  Stethoscope,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

interface DoctorDetails {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  qualifications: string;
  experience: string;
  bio: string;
  consultationFee: number;
  availableDays: string[];
  availableTime: {
    start: string;
    end: string;
  };
}

const BookAppointment = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorDetails | null>(
    null,
  );
  const [formData, setFormData] = useState({
    appointment_date: "",
    appointment_time: "",
    symptoms: "",
    notes: "",
  });
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1: Select Doctor, 2: Fill Details, 3: Payment

  // Fetch doctor details if doctorId is provided
  useEffect(() => {
    if (doctorId) {
      fetchDoctorDetails(doctorId);
    } else {
      setDoctorLoading(false);
    }
  }, [doctorId]);

  const fetchDoctorDetails = async (id: string) => {
    try {
      setDoctorLoading(true);
      const response = await api.get(`/public/doctors/${id}`);
      if (response.data.success) {
        setSelectedDoctor(response.data.data);
      } else {
        toast.error("Doctor not found");
        navigate("/doctors");
      }
    } catch (error) {
      console.error("Error fetching doctor:", error);
      toast.error("Failed to load doctor details");
      navigate("/doctors");
    } finally {
      setDoctorLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      // Validate file type
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        toast.error("Only images and PDFs are allowed");
        return;
      }
      setPaymentScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDoctor || !paymentScreenshot || !user) {
      toast.error("Please complete all steps");
      return;
    }

    setLoading(true);
    try {
      const appointmentData = {
        patient_email: user.email,
        patient_name: user.name,
        patient_phone: user.phone,
        doctor_email: selectedDoctor.email,
        doctor_name: selectedDoctor.name,
        doctor_specialization: selectedDoctor.specialization,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        symptoms: formData.symptoms,
        notes: formData.notes,
        amount: selectedDoctor.consultationFee || 500,
        payment_screenshot: paymentScreenshot,
      };

      const response =
        await appointmentService.bookAppointment(appointmentData);

      if (response.success) {
        toast.success("Appointment booked successfully!");
        navigate("/appointments/status", {
          state: { appointment: response.data },
        });
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.error || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  // Generate time slots (9 AM to 6 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 9; i <= 18; i++) {
      const hour = i > 12 ? i - 12 : i;
      const ampm = i >= 12 ? "PM" : "AM";
      slots.push(`${hour}:00 ${ampm}`);
      if (i !== 18) {
        slots.push(`${hour}:30 ${ampm}`);
      }
    }
    return slots;
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Get max date (30 days from now)
  const getMaxDate = () => {
    const max = new Date();
    max.setDate(max.getDate() + 30);
    return max.toISOString().split("T")[0];
  };

  if (doctorLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Doctors
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Book an Appointment
          </h1>
          <p className="text-gray-600 mt-2">
            Schedule your consultation with a specialist
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8 px-4">
          {["Select Doctor", "Fill Details", "Payment"].map((label, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step > index + 1
                    ? "bg-teal-500 text-white"
                    : step === index + 1
                      ? "bg-teal-600 text-white ring-4 ring-teal-200"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > index + 1 ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>
              {index < 2 && (
                <div
                  className={`w-16 sm:w-24 h-1 ${
                    step > index + 1 ? "bg-teal-500" : "bg-gray-200"
                  }`}
                />
              )}
              <span className="hidden sm:block text-sm ml-2 font-medium text-gray-600">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Step 1: Select Doctor */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Choose Your Doctor
              </h2>

              {selectedDoctor ? (
                // If doctor is pre-selected from URL
                <div className="border-2 border-teal-500 rounded-xl p-6 bg-teal-50">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-teal-100 rounded-full">
                      <Stethoscope className="h-8 w-8 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        Dr. {selectedDoctor.name}
                      </h3>
                      <p className="text-gray-600">
                        {selectedDoctor.specialization}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedDoctor.qualifications}
                      </p>
                      <div className="flex items-center mt-2 text-sm">
                        <DollarSign className="h-4 w-4 text-teal-600" />
                        <span className="font-medium">
                          ₹{selectedDoctor.consultationFee || 500}
                        </span>
                        <span className="text-gray-500 ml-1">
                          consultation fee
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedDoctor.availableDays?.map((day) => (
                          <span
                            key={day}
                            className="px-2 py-0.5 bg-white text-xs rounded-full text-gray-600 border border-gray-200"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Available: {selectedDoctor.availableTime?.start} -{" "}
                        {selectedDoctor.availableTime?.end}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="mt-4 w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Continue with this Doctor
                  </button>
                </div>
              ) : (
                // If no doctor selected, show a message
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Please select a doctor from the list
                  </p>
                  <button
                    onClick={() => navigate("/doctors")}
                    className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    Browse Doctors
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Fill Details */}
          {step === 2 && selectedDoctor && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(3);
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Appointment Details
                </h2>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-teal-600 hover:text-teal-700"
                >
                  Change Doctor
                </button>
              </div>

              <div className="bg-teal-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-teal-100 rounded-full">
                    <Stethoscope className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Dr. {selectedDoctor.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedDoctor.specialization}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    name="appointment_date"
                    required
                    value={formData.appointment_date}
                    onChange={handleInputChange}
                    min={getTodayDate()}
                    max={getMaxDate()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Appointment Time *
                  </label>
                  <select
                    name="appointment_time"
                    required
                    value={formData.appointment_time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="">Select time</option>
                    {generateTimeSlots().map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Symptoms / Reason for visit *
                  </label>
                  <textarea
                    name="symptoms"
                    rows={3}
                    required
                    value={formData.symptoms}
                    onChange={handleInputChange}
                    placeholder="Describe your symptoms or reason for consultation"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    rows={2}
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any additional information for the doctor"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Payment */}
          {step === 3 && selectedDoctor && (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Complete Payment
              </h2>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-6">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Please follow these steps:</strong>
                    </p>
                    <ol className="text-sm text-yellow-700 list-decimal list-inside mt-1 space-y-1">
                      <li>Scan the QR code below to make the payment</li>
                      <li>Take a screenshot of the successful payment</li>
                      <li>Upload the screenshot here</li>
                      <li>Click "Book Appointment" to confirm</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* QR Code Section */}
                <div className="border-2 border-gray-200 rounded-xl p-6 text-center">
                  <h3 className="font-medium text-gray-900 mb-4">
                    Scan to Pay
                  </h3>
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <div className="w-48 h-48 bg-gray-100 mx-auto flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center">
                        <div className="text-5xl mb-2">📱</div>
                        <p className="text-sm text-gray-500 font-medium">
                          QR Code
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Amount: ₹{selectedDoctor.consultationFee || 500}
                        </p>
                        <p className="text-xs text-gray-400">
                          UPI: swastha@pay
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">
                      Pay{" "}
                      <span className="font-bold text-teal-600">
                        ₹{selectedDoctor.consultationFee || 500}
                      </span>{" "}
                      via UPI
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Scan QR with any UPI app
                    </p>
                  </div>
                </div>

                {/* Upload Screenshot */}
                <div className="border-2 border-gray-200 rounded-xl p-6">
                  <h3 className="font-medium text-gray-900 mb-4">
                    Upload Payment Screenshot
                  </h3>

                  {!previewUrl ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors">
                      <input
                        type="file"
                        id="payment-screenshot"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        required
                      />
                      <label
                        htmlFor="payment-screenshot"
                        className="cursor-pointer block"
                      >
                        <div className="text-5xl mb-3">📸</div>
                        <p className="text-gray-600 font-medium">
                          Click to upload screenshot
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          JPG, PNG, PDF (max 5MB)
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Payment screenshot"
                        className="w-full rounded-lg border border-gray-200 max-h-64 object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentScreenshot(null);
                          setPreviewUrl(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                      <p className="text-sm text-green-600 mt-2 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Screenshot uploaded successfully
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Doctor</p>
                    <p className="font-medium">Dr. {selectedDoctor.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-xl font-bold text-teal-600">
                      ₹{selectedDoctor.consultationFee || 500}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !paymentScreenshot}
                  className="px-6 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Booking...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Book Appointment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
