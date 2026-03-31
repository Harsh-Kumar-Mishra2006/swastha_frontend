// contexts/AuthContext.tsx - Complete fixed version

import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { type User, type LoginCredentials, type SignupData } from "../types";
import authService from "../services/authService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { isAxiosError, getErrorMessage } from "../utils/errorHandler";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
  isDoctor: boolean;
  isPatient: boolean;
  isAdmin: boolean;
  isMLT: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper function to ensure user type safety
  const ensureUserType = (userData: any): User => {
    return {
      ...userData,
      role: userData.role as "patient" | "doctor" | "admin" | "MLT",
    };
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          const typedUser = ensureUserType(parsedUser);
          setUser(typedUser);
          // Optionally refresh profile from server
          await refreshProfile();
        } catch (error) {
          console.error("Failed to load stored user:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);

      if (response.success) {
        const userData = ensureUserType(response.user);

        localStorage.setItem("token", response.data);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        toast.success(response.message || "Login successful!");

        // Redirect based on role
        if (userData.role === "patient") {
          navigate("/patient/dashboard");
        } else if (userData.role === "doctor") {
          navigate("/doctor/dashboard");
        } else if (userData.role === "admin") {
          navigate("/admin/dashboard");
        } else if (userData.role === "MLT") {
          navigate("/mlt/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    try {
      setLoading(true);
      const response = await authService.signup(data);

      if (response.success) {
        toast.success(response.message || "Account created successfully!");

        // Auto-login after signup
        const loginCredentials: LoginCredentials = {
          email: data.email,
          password: data.password,
        };

        await login(loginCredentials);
      }
    } catch (error: unknown) {
      console.error("Signup error:", error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Signup failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/");
      setLoading(false);
    }
  };

  const updateUser = (updatedUser: User) => {
    const typedUser = ensureUserType(updatedUser);
    setUser(typedUser);
    localStorage.setItem("user", JSON.stringify(typedUser));
  };

  const refreshProfile = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success) {
        const userData = ensureUserType(response.user);
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error: unknown) {
      console.error("Failed to refresh profile:", error);
      // If token is invalid, logout
      if (isAxiosError(error) && error.response?.status === 401) {
        await logout();
      }
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUser,
    refreshProfile,
    isAuthenticated: !!user,
    isDoctor: user?.role === "doctor",
    isPatient: user?.role === "patient",
    isAdmin: user?.role === "admin",
    isMLT: user?.role === "MLT",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
