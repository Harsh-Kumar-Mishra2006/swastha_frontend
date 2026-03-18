// contexts/AdminContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "../hooks/useAuth";
import adminService from "../services/adminService";
import toast from "react-hot-toast";

export interface Doctor {
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
  status: "active" | "inactive" | "pending";
  addedBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface AddDoctorData {
  name: string;
  email: string;
  username: string;
  phone: string;
  password: string;
  specialization: string;
  qualifications: string;
  experience: string;
  bio?: string;
  consultationFee?: number;
  availableDays?: string[];
  availableTime?: {
    start: string;
    end: string;
  };
}

interface AdminContextType {
  doctors: Doctor[];
  loading: boolean;
  stats: {
    total: number;
    active: number;
    pending: number;
    inactive: number;
    bySpecialization: Array<{ _id: string; count: number }>;
  } | null;
  fetchDoctors: () => Promise<void>;
  fetchStats: () => Promise<void>;
  addDoctor: (doctorData: AddDoctorData) => Promise<void>;
  updateDoctorStatus: (doctorId: string, status: string) => Promise<void>;
  deleteDoctor: (doctorId: string, permanent?: boolean) => Promise<void>;
  resetDoctorPassword: (doctorId: string, newPassword: string) => Promise<void>;
  getDoctorById: (doctorId: string) => Promise<Doctor | null>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllDoctors();
      if (response.success) {
        setDoctors(response.data);
      }
    } catch (error: any) {
      console.error("Fetch doctors error:", error);
      toast.error(error.response?.data?.error || "Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminService.getDoctorStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error("Fetch stats error:", error);
    }
  };

  // contexts/AdminContext.tsx - Update addDoctor function
  const addDoctor = async (doctorData: AddDoctorData) => {
    try {
      setLoading(true);

      // Validate password
      if (!doctorData.password || doctorData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      console.log("🚀 Calling adminService.addDoctor with:", {
        ...doctorData,
        password: "[REDACTED]",
      });

      const response = await adminService.addDoctor(doctorData);

      console.log("✅ Response from server:", response);

      if (response.success) {
        toast.success(
          <div>
            <p className="font-bold">Doctor added successfully!</p>
            <p className="text-sm">
              They can now login with the provided password.
            </p>
          </div>,
          { duration: 5000 },
        );

        await fetchDoctors();
        await fetchStats();
      }
    } catch (error: any) {
      console.error("❌ Add doctor error:", error);

      // Show the exact error message from backend
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to add doctor";

      // Log full error details
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      }

      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateDoctorStatus = async (doctorId: string, status: string) => {
    try {
      setLoading(true);
      const response = await adminService.updateDoctorStatus(doctorId, status);
      if (response.success) {
        toast.success(`Doctor status updated to ${status}`);
        await fetchDoctors();
        await fetchStats();
      }
    } catch (error: any) {
      console.error("Update status error:", error);
      toast.error(error.response?.data?.error || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const deleteDoctor = async (doctorId: string, permanent: boolean = false) => {
    try {
      setLoading(true);
      const response = await adminService.deleteDoctor(doctorId, permanent);
      if (response.success) {
        toast.success(
          permanent ? "Doctor permanently deleted" : "Doctor deactivated",
        );
        await fetchDoctors();
        await fetchStats();
      }
    } catch (error: any) {
      console.error("Delete doctor error:", error);
      toast.error(error.response?.data?.error || "Failed to delete doctor");
    } finally {
      setLoading(false);
    }
  };

  const resetDoctorPassword = async (doctorId: string, newPassword: string) => {
    try {
      setLoading(true);

      if (!newPassword || newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      const response = await adminService.resetDoctorPassword(
        doctorId,
        newPassword,
      );

      if (response.success) {
        toast.success(
          <div>
            <p className="font-bold">Password reset successfully!</p>
            <p className="text-sm">
              Doctor can now login with the new password.
            </p>
          </div>,
          { duration: 5000 },
        );
      }
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(error.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const getDoctorById = async (doctorId: string): Promise<Doctor | null> => {
    try {
      const response = await adminService.getDoctorById(doctorId);
      if (response.success) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Get doctor by ID error:", error);
      return null;
    }
  };

  // Load initial data
  useEffect(() => {
    if (user?.role === "admin") {
      fetchDoctors();
      fetchStats();
    }
  }, [user]);

  return (
    <AdminContext.Provider
      value={{
        doctors,
        loading,
        stats,
        fetchDoctors,
        fetchStats,
        addDoctor,
        updateDoctorStatus,
        deleteDoctor,
        resetDoctorPassword,
        getDoctorById,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
