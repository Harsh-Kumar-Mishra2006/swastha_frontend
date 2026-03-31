// pages/Signup.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Stethoscope,
  AlertCircle,
  Microscope,
  Users,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "patient" as "patient" | "doctor" | "admin" | "MLT",
    age: "",
    gender: "",
    dob: "",
  });
  const [step, setStep] = useState(1);
  const [roleError, setRoleError] = useState<string | null>(null);
  const { signup, loading } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear role error when changing role
    if (e.target.name === "role") {
      setRoleError(null);
    }
  };

  // Add this to your signup component to see detailed errors
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const signupData = {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        age: formData.age || undefined,
        gender: formData.gender || undefined,
        dob: formData.dob || undefined,
      };

      console.log("Submitting signup data:", signupData); // Debug log

      await signup(signupData);
    } catch (error: any) {
      console.error("Signup error details:", error.response?.data); // Debug log

      // Show specific error based on response
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Signup failed. Please check your information.");
      }

      // Set role-specific error
      if (error.response?.data?.error?.includes("contact admin")) {
        setRoleError(error.response.data.error);
      }
    }
  };

  const getRoleMessage = (role: string) => {
    switch (role) {
      case "doctor":
        return "Doctor accounts require admin verification. You can still register, but you'll need to wait for admin approval before accessing doctor features.";
      case "MLT":
        return "MLT accounts require admin verification. You can still register, but you'll need to wait for admin approval before accessing lab features.";
      case "admin":
        return "Admin accounts are restricted. Please contact the system administrator for access.";
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div>
          <div className="flex justify-center">
            <Stethoscope className="h-12 w-12 text-teal-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your Swastha account
          </h2>
        </div>

        {/* Role-specific Warning Message */}
        {getRoleMessage(formData.role) && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-blue-400" />
              <p className="ml-3 text-sm text-blue-700">
                {getRoleMessage(formData.role)}
              </p>
            </div>
          </div>
        )}

        {/* Role-specific Error Message */}
        {roleError && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-700">{roleError}</p>
            </div>
          </div>
        )}

        {/* Role Selection Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              value: "patient",
              label: "Patient",
              icon: Users,
              color: "bg-teal-500",
            },
            {
              value: "doctor",
              label: "Doctor",
              icon: Users,
              color: "bg-blue-500",
            },
            {
              value: "MLT",
              label: "Lab Technician",
              icon: Microscope,
              color: "bg-purple-500",
            },
            {
              value: "admin",
              label: "Admin",
              icon: Shield,
              color: "bg-red-500",
            },
          ].map((role) => (
            <button
              key={role.value}
              type="button"
              onClick={() =>
                setFormData({ ...formData, role: role.value as any })
              }
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.role === role.value
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-200 hover:border-teal-300"
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={`p-2 rounded-full ${role.color} bg-opacity-10`}>
                  <role.icon
                    className={`h-6 w-6 text-${role.color.replace("bg-", "")}`}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {role.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center">
          <div
            className={`flex-1 h-1 ${step >= 1 ? "bg-teal-600" : "bg-gray-200"}`}
          />
          <div
            className={`flex-1 h-1 ${step >= 2 ? "bg-teal-600" : "bg-gray-200"}`}
          />
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {step === 1 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Account Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Create a password (min. 6 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Personal Information (Optional)
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter your age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
            )}

            {step === 1 ? (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="ml-auto px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="ml-auto px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            )}
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-teal-600 hover:text-teal-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
