// sections/admin/AddDoctorSection.tsx
import React, { useState } from "react";
import { useAdmin } from "../../contexts/AdminContext";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Check,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";

const AddDoctorForm = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    qualifications: "",
    experience: "",
    bio: "",
    consultationFee: "",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    availableTime: {
      start: "09:00",
      end: "17:00",
    },
  });

  const { addDoctor, loading } = useAdmin();

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Check password strength
    if (name === "password") {
      let strength = 0;
      if (value.length >= 6) strength += 25;
      if (value.match(/[a-z]/)) strength += 25;
      if (value.match(/[A-Z]/)) strength += 25;
      if (value.match(/[0-9]/)) strength += 25;
      setPasswordStrength(strength);
    }
  };

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const validateForm = () => {
    // Check required fields
    const requiredFields = [
      "name",
      "email",
      "username",
      "phone",
      "password",
      "specialization",
      "qualifications",
      "experience",
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(
          `Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`,
        );
        return false;
      }
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Validate phone
    const phoneRegex = /^[0-9+\-\s]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid phone number");
      return false;
    }

    // Validate password
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  // sections/admin/AddDoctorSection.tsx - Update handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Log form data before submission
    console.log("📝 Form data before submission:", {
      name: formData.name,
      email: formData.email,
      username: formData.username,
      phone: formData.phone,
      passwordLength: formData.password.length,
      specialization: formData.specialization,
      qualifications: formData.qualifications,
      experience: formData.experience,
      consultationFee: formData.consultationFee,
      availableDays: formData.availableDays,
      availableTime: formData.availableTime,
      bio: formData.bio || "(empty)",
    });

    try {
      const doctorData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        username: formData.username.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        specialization: formData.specialization.trim(),
        qualifications: formData.qualifications.trim(),
        experience: formData.experience.trim(),
        bio: formData.bio?.trim() || undefined,
        consultationFee: formData.consultationFee
          ? parseFloat(formData.consultationFee)
          : undefined,
        availableDays: formData.availableDays,
        availableTime: formData.availableTime,
      };

      console.log("📦 Prepared doctor data for API:", {
        ...doctorData,
        password: "[REDACTED]",
      });

      await addDoctor(doctorData);

      // Reset form on success
      setFormData({
        name: "",
        email: "",
        username: "",
        phone: "",
        password: "",
        confirmPassword: "",
        specialization: "",
        qualifications: "",
        experience: "",
        bio: "",
        consultationFee: "",
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        availableTime: { start: "09:00", end: "17:00" },
      });
      setPasswordStrength(0);
      setIsExpanded(false);
    } catch (error: any) {
      console.error("❌ Form submission error:", error);
      // Error is already shown in context
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return "bg-red-500";
    if (passwordStrength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 50) return "Weak";
    if (passwordStrength < 75) return "Medium";
    return "Strong";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div
        className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="bg-teal-100 p-2 rounded-lg">
            <Plus className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Add New Doctor
            </h2>
            <p className="text-sm text-gray-600">Create a new doctor account</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </div>

      {/* Form */}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="p-6 border-t border-gray-100">
          {/* Info Banner */}
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <div className="flex">
              <Info className="h-5 w-5 text-blue-400 mr-2" />
              <div>
                <p className="text-sm text-blue-700">
                  <span className="font-bold">Important:</span> The password you
                  set here will be used by the doctor to login. Make sure to
                  share it securely with the doctor.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Personal Information
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Dr. John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="doctor@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="drjohn"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="+1234567890"
                required
              />
            </div>

            {/* Password Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-10"
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getPasswordStrengthColor()} transition-all`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Doctor will use this password to login
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  formData.confirmPassword &&
                  formData.password !== formData.confirmPassword
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Confirm password"
                required
              />
              {formData.confirmPassword &&
                formData.password === formData.confirmPassword && (
                  <p className="mt-1 text-xs text-green-600 flex items-center">
                    <Check className="h-3 w-3 mr-1" /> Passwords match
                  </p>
                )}
            </div>

            {/* Professional Information */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Professional Information
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialization <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Cardiology"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qualifications <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="MBBS, MD"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="10 years"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consultation Fee (₹)
              </label>
              <input
                type="number"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="500"
                min="0"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Tell us about the doctor..."
              />
            </div>

            {/* Availability */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Availability
              </h3>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Days
              </label>
              <div className="flex flex-wrap gap-2">
                {weekDays.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.availableDays.includes(day)
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={formData.availableTime.start}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    availableTime: {
                      ...prev.availableTime,
                      start: e.target.value,
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={formData.availableTime.end}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    availableTime: {
                      ...prev.availableTime,
                      end: e.target.value,
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                "Add Doctor"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddDoctorForm;
