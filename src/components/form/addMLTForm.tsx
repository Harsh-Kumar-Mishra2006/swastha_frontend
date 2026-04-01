// components/form/addMLTForm.tsx
import React, { useState } from "react";
import { useMLT } from "../../contexts/MLTContext";
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

const AddMLTForm = () => {
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
    specialization: "Hematology",
    qualifications: "",
    experience: "",
    licenseNumber: "",
    department: "Clinical Lab",
    bio: "",
  });

  // Safely use the MLT context
  let addMLT: any = null;
  let loading = false;

  try {
    const context = useMLT();
    addMLT = context.addMLT;
    loading = context.loading;
  } catch (error) {
    console.error("MLTContext not available in AddMLTForm:", error);
  }

  const specializations = [
    "Hematology",
    "Microbiology",
    "Biochemistry",
    "Pathology",
    "Radiology",
    "Other",
  ];

  const departments = [
    "Clinical Lab",
    "Pathology",
    "Radiology",
    "Blood Bank",
    "Microbiology",
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
      "licenseNumber",
      "department",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!addMLT) {
      toast.error("MLT service not available. Please refresh the page.");
      return;
    }

    if (!validateForm()) return;

    console.log("📝 Form data before submission:", {
      name: formData.name,
      email: formData.email,
      username: formData.username,
      phone: formData.phone,
      passwordLength: formData.password.length,
      specialization: formData.specialization,
      qualifications: formData.qualifications,
      experience: formData.experience,
      licenseNumber: formData.licenseNumber,
      department: formData.department,
      bio: formData.bio || "(empty)",
    });

    try {
      const mltData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        username: formData.username.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        specialization: formData.specialization,
        qualifications: formData.qualifications.trim(),
        experience: formData.experience.trim(),
        licenseNumber: formData.licenseNumber.trim(),
        department: formData.department,
        bio: formData.bio?.trim() || undefined,
      };

      console.log("📦 Prepared MLT data for API:", {
        ...mltData,
        password: "[REDACTED]",
      });

      await addMLT(mltData);

      // Reset form on success
      setFormData({
        name: "",
        email: "",
        username: "",
        phone: "",
        password: "",
        confirmPassword: "",
        specialization: "Hematology",
        qualifications: "",
        experience: "",
        licenseNumber: "",
        department: "Clinical Lab",
        bio: "",
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
          <div className="bg-purple-100 p-2 rounded-lg">
            <Plus className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add New MLT</h2>
            <p className="text-sm text-gray-600">
              Create a new Medical Lab Technician account
            </p>
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
          <div className="mb-6 bg-purple-50 border-l-4 border-purple-400 p-4 rounded">
            <div className="flex">
              <Info className="h-5 w-5 text-purple-400 mr-2" />
              <div>
                <p className="text-sm text-purple-700">
                  <span className="font-bold">Important:</span> The password you
                  set here will be used by the MLT to login. Make sure to share
                  it securely with the technician.
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="John Smith"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="mlt@example.com"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="johnmlt"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
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
                MLT will use this password to login
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
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
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
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="MLT12345"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="B.Sc MLT, M.Sc Medical Lab Technology"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="5 years"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio (Optional)
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Tell us about the technician's expertise..."
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
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                "Add MLT"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddMLTForm;
