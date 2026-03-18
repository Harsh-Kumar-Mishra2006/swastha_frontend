// contexts/AuthContext.tsx
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

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        // Optionally refresh profile from server
        try {
          await refreshProfile();
        } catch (error) {
          console.error("Failed to refresh profile:", error);
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
        localStorage.setItem("token", response.data);
        localStorage.setItem("user", JSON.stringify(response.user));
        setUser(response.user);
        toast.success(response.message || "Login successful!");

        // Redirect based on role
        if (response.user.role === "patient") {
          navigate("/patient/dashboard");
        } else if (response.user.role === "doctor") {
          navigate("/doctor/dashboard");
        } else if (response.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.error || "Login failed");
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
    } catch (error: any) {
      console.error("Signup error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Signup failed";
      toast.error(errorMessage);
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
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const refreshProfile = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success) {
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
      }
    } catch (error) {
      console.error("Failed to refresh profile:", error);
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
