// pages/Login.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Stethoscope,
  Mail,
  User,
  AlertCircle,
  Users,
  Microscope,
  Shield,
} from "lucide-react";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [loginMethod, setLoginMethod] = useState<"email" | "username">("email");
  const [selectedRole, setSelectedRole] = useState<string>("patient");
  const [error, setError] = useState<string | null>(null);
  const { login, loading } = useAuth();

  const roles = [
    { value: "patient", label: "Patient", icon: Users, color: "bg-teal-500" },
    { value: "doctor", label: "Doctor", icon: Users, color: "bg-blue-500" },
    {
      value: "MLT",
      label: "Lab Technician",
      icon: Microscope,
      color: "bg-purple-500",
    },
    { value: "admin", label: "Admin", icon: Shield, color: "bg-red-500" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const loginData =
        loginMethod === "email"
          ? { email: credentials.email, password: credentials.password }
          : { username: credentials.username, password: credentials.password };

      await login(loginData);
      // Navigation happens in AuthContext
    } catch (error: any) {
      setError(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div>
          <div className="flex justify-center">
            <Stethoscope className="h-12 w-12 text-teal-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome back to Swastha
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-2 gap-3">
          {roles.map((role) => (
            <button
              key={role.value}
              type="button"
              onClick={() => setSelectedRole(role.value)}
              className={`p-3 rounded-xl border-2 transition-all ${
                selectedRole === role.value
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-200 hover:border-teal-300"
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <div className={`p-2 rounded-full ${role.color} bg-opacity-10`}>
                  <role.icon
                    className={`h-5 w-5 text-${role.color.replace("bg-", "")}`}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {role.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Login Method Toggle */}
            <div className="flex justify-center space-x-4 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setLoginMethod("email")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === "email"
                    ? "bg-white text-teal-600 shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Mail className="h-4 w-4 inline mr-2" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod("username")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === "username"
                    ? "bg-white text-teal-600 shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <User className="h-4 w-4 inline mr-2" />
                Username
              </button>
            </div>

            {loginMethod === "email" ? (
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter your email"
                />
              </div>
            ) : (
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter your username"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Signing in..."
                : `Sign in as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-teal-600 hover:text-teal-500"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Role-specific info */}
        <div className="mt-4 text-xs text-gray-500 text-center border-t pt-4">
          {selectedRole === "doctor" && (
            <p>Doctor? Register and wait for admin approval</p>
          )}
          {selectedRole === "MLT" && (
            <p>Lab Technician? Register and wait for admin approval</p>
          )}
          {selectedRole === "admin" && (
            <p>Admin? Contact system administrator for access</p>
          )}
          {selectedRole === "patient" && (
            <p>Patient? Sign up now to book appointments</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
