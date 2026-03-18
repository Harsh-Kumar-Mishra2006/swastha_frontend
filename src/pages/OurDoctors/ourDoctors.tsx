// pages/OurDoctors.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  Stethoscope,
  Calendar,
  Clock,
  IndianRupee,
  Star,
  Briefcase,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

interface Doctor {
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
  rating?: number;
  totalPatients?: number;
}

const OurDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [specializations, setSpecializations] = useState<string[]>([]);
  const { isAuthenticated } = useAuth();

  const doctorsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, [currentPage, selectedSpecialization]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      // Use public API endpoint instead of admin
      const response = await api.get("/public/doctors", {
        params: {
          page: currentPage,
          limit: doctorsPerPage,
          specialization:
            selectedSpecialization !== "all"
              ? selectedSpecialization
              : undefined,
        },
      });

      if (response.data.success) {
        setDoctors(response.data.data);
        setSpecializations(response.data.specializations || []);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (error: any) {
      console.error("Error fetching doctors:", error);
      toast.error(error.response?.data?.error || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = (doctorId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to book an appointment");
      navigate("/login");
      return;
    }
    navigate(`/book-appointment/${doctorId}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = (name: string) => {
    const colors = [
      "from-teal-500 to-emerald-500",
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-purple-500",
      "from-green-500 to-teal-500",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  if (loading && doctors.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our Expert Doctors
            </h1>
            <p className="text-xl text-gray-600">
              Loading amazing healthcare professionals...
            </p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Expert Doctors
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet our team of experienced and compassionate healthcare
            professionals
          </p>
        </div>

        {/* Filters */}
        {specializations.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setSelectedSpecialization("all")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedSpecialization === "all"
                  ? "bg-teal-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-teal-50"
              }`}
            >
              All Doctors
            </button>
            {specializations.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialization(spec)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedSpecialization === spec
                    ? "bg-teal-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-teal-50"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        )}

        {/* Doctors Grid */}
        {doctors.length === 0 ? (
          <div className="text-center py-12">
            <Stethoscope className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No Doctors Found
            </h3>
            <p className="text-gray-600">Check back later for new doctors</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Doctor Card Header with Gradient */}
                  <div
                    className={`bg-gradient-to-r ${getRandomColor(doctor.name)} p-6 text-white relative`}
                  >
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                        {doctor.specialization}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="h-20 w-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl font-bold">
                        {getInitials(doctor.name)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-1">
                          Dr. {doctor.name}
                        </h3>
                        <p className="text-white/90 text-sm">
                          {doctor.qualifications}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Details */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <Briefcase className="h-4 w-4 mr-1 text-teal-600" />
                        <span>{doctor.experience} experience</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <IndianRupee className="h-4 w-4 mr-1 text-teal-600" />
                        <span className="font-semibold">
                          ₹{doctor.consultationFee}
                        </span>
                      </div>
                    </div>

                    {/* Rating (simulated) */}
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= (doctor.rating || 4)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">
                        ({doctor.totalPatients || 120}+ patients)
                      </span>
                    </div>

                    {/* Bio */}
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {doctor.bio ||
                        `Experienced ${doctor.specialization} specialist with expertise in treating complex medical conditions.`}
                    </p>

                    {/* Availability */}
                    <div className="bg-teal-50 rounded-xl p-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-700">
                        <Calendar className="h-4 w-4 mr-2 text-teal-600" />
                        <span className="font-medium">Available:</span>
                        <span className="ml-2">
                          {doctor.availableDays.slice(0, 3).join(" · ")}
                          {doctor.availableDays.length > 3 && " ..."}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <Clock className="h-4 w-4 mr-2 text-teal-600" />
                        <span className="font-medium">Time:</span>
                        <span className="ml-2">
                          {doctor.availableTime.start} -{" "}
                          {doctor.availableTime.end}
                        </span>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        <span className="truncate max-w-[120px]">
                          {doctor.email}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        <span>{doctor.phone}</span>
                      </div>
                    </div>

                    {/* Book Appointment Button */}
                    <button
                      onClick={() => handleBookAppointment(doctor._id)}
                      className="w-full mt-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all transform group-hover:scale-[1.02] shadow-md hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                      <Calendar className="h-5 w-5" />
                      <span>Book Appointment</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center space-x-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white text-gray-700 hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex items-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          currentPage === page
                            ? "bg-teal-600 text-white shadow-lg"
                            : "bg-white text-gray-700 hover:bg-teal-50"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white text-gray-700 hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OurDoctors;
