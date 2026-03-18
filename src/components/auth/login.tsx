// pages/Login.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Stethoscope, Mail, User, AlertCircle } from "lucide-react";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [loginMethod, setLoginMethod] = useState<"email" | "username">("email");
  const [error, setError] = useState<string | null>(null);
  const { login, loading } = useAuth();

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
              {loading ? "Signing in..." : "Sign in"}
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
          <p>Doctor? Register and wait for admin approval</p>
          <p className="mt-1">Admin? Contact system administrator for access</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
