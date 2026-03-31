// pages/OurDoctors.tsx
import { useState, useEffect, useMemo } from "react";
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
  Search,
  Shield,
  Filter,
  X,
  Syringe,
  Heart,
  Brain,
  Bone,
  Eye,
  Baby,
  Microscope,
  Zap,
  Lock,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import {
  specializationDiseases,
  getAllSpecializations,
  searchDiseases,
  getAllDiseases,
} from "../../data/specializationDiseases";

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

interface FilterState {
  type: "specialization" | "disease";
  value: string;
}

const OurDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [_selectedDisease, setSelectedDisease] = useState("");
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [showDiseaseSuggestions, setShowDiseaseSuggestions] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterState>({
    type: "specialization",
    value: "all",
  });
  const { isAuthenticated, user } = useAuth();

  const doctorsPerPage = 6;
  const navigate = useNavigate();

  // Check if user is a patient
  const isPatient = user?.role === "patient";
  const canBookAppointment = isAuthenticated && isPatient;

  // Get all available specializations from backend or use from disease data
  const allSpecializations = useMemo(() => {
    if (specializations.length > 0) return specializations;
    return getAllSpecializations();
  }, [specializations]);

  // All diseases list
  const allDiseases = useMemo(() => getAllDiseases(), []);

  useEffect(() => {
    fetchDoctors();
  }, [currentPage, selectedSpecialization]);

  // Handle disease search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        const results = searchDiseases(searchQuery);
        setSearchResults(results);
        setShowDiseaseSuggestions(true);
      } else {
        setSearchResults([]);
        setShowDiseaseSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      let specializationParam = selectedSpecialization;

      // If filtering by disease, get matching specializations
      if (activeFilter.type === "disease" && activeFilter.value !== "all") {
        const matchingSpecializations = specializationDiseases
          .filter((item) => item.disease === activeFilter.value)
          .map((item) => item.specialization);

        specializationParam = matchingSpecializations[0] || "all";
      }

      const response = await api.get("/public/doctors", {
        params: {
          page: currentPage,
          limit: doctorsPerPage,
          specialization:
            specializationParam !== "all" ? specializationParam : undefined,
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

  const handleDiseaseSelect = (disease: string) => {
    setSelectedDisease(disease);
    setSearchQuery(disease);
    setShowDiseaseSuggestions(false);
    setActiveFilter({ type: "disease", value: disease });
    setSelectedSpecialization("all");
    setCurrentPage(1);

    const matchingSpecializations = specializationDiseases
      .filter((item) => item.disease === disease)
      .map((item) => item.specialization);

    if (matchingSpecializations.length > 0) {
      toast.success(
        `Showing doctors for ${disease} (${matchingSpecializations.join(", ")})`,
      );
      fetchDoctors();
    } else {
      toast.error("No matching doctors found for this disease");
    }
  };

  const handleSpecializationSelect = (spec: string) => {
    setSelectedSpecialization(spec);
    setActiveFilter({ type: "specialization", value: spec });
    setSelectedDisease("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedSpecialization("all");
    setSelectedDisease("");
    setSearchQuery("");
    setActiveFilter({ type: "specialization", value: "all" });
    setCurrentPage(1);
    toast.success("All filters cleared");
  };

  const handleBookAppointment = (doctorId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to book an appointment");
      navigate("/login");
      return;
    }

    if (!isPatient) {
      toast.error("Only patients can book appointments");
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

  const getSpecializationIcon = (specialization: string) => {
    const icons: Record<string, any> = {
      Cardiology: Heart,
      Dermatology: Zap,
      Neurology: Brain,
      Orthopedics: Bone,
      Pediatrics: Baby,
      Ophthalmology: Eye,
      Gynecology: Heart,
      Dentistry: Stethoscope,
      Psychiatry: Brain,
      Gastroenterology: Microscope,
    };
    const Icon = icons[specialization] || Stethoscope;
    return <Icon className="h-5 w-5" />;
  };

  // Role-based message for booking
  const getBookingMessage = () => {
    if (!isAuthenticated) {
      return {
        message: "Login to book appointment",
        icon: Lock,
        color: "bg-gray-500",
      };
    }
    if (user?.role === "doctor") {
      return {
        message: "Doctors can't book appointments",
        icon: UserCheck,
        color: "bg-blue-500",
      };
    }
    if (user?.role === "MLT") {
      return {
        message: "Lab technicians can't book appointments",
        icon: Microscope,
        color: "bg-purple-500",
      };
    }
    if (user?.role === "admin") {
      return {
        message: "Admins can't book appointments",
        icon: Shield,
        color: "bg-red-500",
      };
    }
    return null;
  };

  const bookingRestriction = getBookingMessage();

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

        {/* Role-based Info Banner */}
        {!isPatient && isAuthenticated && (
          <div className="mb-6 max-w-2xl mx-auto">
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-amber-400 mr-3" />
                <p className="text-sm text-amber-700">
                  You are logged in as a <strong>{user?.role}</strong>. Only
                  patients can book appointments.
                  {user?.role === "doctor" && (
                    <span className="block text-xs mt-1">
                      You can manage your appointments from your doctor
                      dashboard.
                    </span>
                  )}
                  {user?.role === "MLT" && (
                    <span className="block text-xs mt-1">
                      You can view lab test requests from your MLT dashboard.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Search Bar with Disease Filter */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by disease (e.g., Migraine, Heart Attack, Back Pain) or type your symptoms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() =>
                  searchQuery.trim() && setShowDiseaseSuggestions(true)
                }
                className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all shadow-lg bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowDiseaseSuggestions(false);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Disease Suggestions Dropdown */}
            {showDiseaseSuggestions && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
                {searchResults.map((disease, index) => (
                  <button
                    key={index}
                    onClick={() => handleDiseaseSelect(disease)}
                    className="w-full text-left px-4 py-3 hover:bg-teal-50 transition-colors flex items-center space-x-3 border-b border-gray-100 last:border-0"
                  >
                    <Syringe className="h-5 w-5 text-teal-600" />
                    <div>
                      <p className="font-medium text-gray-900">{disease}</p>
                      <p className="text-sm text-gray-500">
                        See doctors specializing in {disease}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Filter Display */}
        {activeFilter.value !== "all" && (
          <div className="mb-6 flex justify-center">
            <div className="bg-teal-100 rounded-full px-4 py-2 flex items-center space-x-2">
              <Filter className="h-4 w-4 text-teal-700" />
              <span className="text-sm text-teal-700 font-medium">
                {activeFilter.type === "disease"
                  ? `Showing doctors for: ${activeFilter.value}`
                  : `Specialization: ${activeFilter.value}`}
              </span>
              <button
                onClick={clearFilters}
                className="ml-2 p-1 hover:bg-teal-200 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-teal-700" />
              </button>
            </div>
          </div>
        )}

        {/* Quick Disease Chips */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={clearFilters}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter.value === "all"
                  ? "bg-teal-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-teal-50"
              }`}
            >
              All Doctors
            </button>
            {allDiseases.slice(0, 8).map((disease) => (
              <button
                key={disease}
                onClick={() => handleDiseaseSelect(disease)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter.type === "disease" &&
                  activeFilter.value === disease
                    ? "bg-teal-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-teal-50"
                }`}
              >
                {disease}
              </button>
            ))}
          </div>
        </div>

        {/* Specialization Filters */}
        {allSpecializations.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {allSpecializations.map((spec) => (
                <button
                  key={spec}
                  onClick={() => handleSpecializationSelect(spec)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-2 ${
                    activeFilter.type === "specialization" &&
                    activeFilter.value === spec
                      ? "bg-teal-600 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-teal-50"
                  }`}
                >
                  {getSpecializationIcon(spec)}
                  <span>{spec}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Doctors Grid */}
        {doctors.length === 0 ? (
          <div className="text-center py-12">
            <Stethoscope className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No Doctors Found
            </h3>
            <p className="text-gray-600">
              {activeFilter.value !== "all"
                ? `No doctors available for ${activeFilter.value}. Try a different filter.`
                : "Check back later for new doctors"}
            </p>
            {activeFilter.value !== "all" && (
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
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
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                        {getSpecializationIcon(doctor.specialization)}
                        <span>{doctor.specialization}</span>
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

                    {/* Book Appointment Button - Role Based */}
                    {!canBookAppointment ? (
                      <div className="relative group">
                        <button
                          disabled
                          className="w-full mt-4 bg-gray-300 text-gray-500 py-3 rounded-xl font-semibold cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {bookingRestriction?.icon && (
                            <bookingRestriction.icon className="h-5 w-5" />
                          )}
                          <span>
                            {bookingRestriction?.message ||
                              "Cannot Book Appointment"}
                          </span>
                        </button>
                        {!isAuthenticated && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Please login to book appointments
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleBookAppointment(doctor._id)}
                        className="w-full mt-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all transform group-hover:scale-[1.02] shadow-md hover:shadow-xl flex items-center justify-center space-x-2"
                      >
                        <Calendar className="h-5 w-5" />
                        <span>Book Appointment</span>
                      </button>
                    )}
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
