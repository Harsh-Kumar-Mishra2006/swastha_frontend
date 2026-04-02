// contexts/AdminMLTContext.tsx
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

export interface MLT {
  _id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  specialization: string;
  qualifications: string;
  experience: string;
  licenseNumber: string;
  department: string;
  bio: string;
  status: "active" | "inactive" | "pending";
  addedBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface AddMLTData {
  name: string;
  email: string;
  username: string;
  phone: string;
  password: string;
  specialization: string;
  qualifications: string;
  experience: string;
  licenseNumber: string;
  department: string;
  bio?: string;
}

interface AdminMLTContextType {
  mlts: MLT[];
  loading: boolean;
  stats: {
    total: number;
    active: number;
    pending: number;
    inactive: number;
    bySpecialization: Array<{ _id: string; count: number }>;
    byDepartment: Array<{ _id: string; count: number }>;
  } | null;
  fetchMLTs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  addMLT: (mltData: AddMLTData) => Promise<void>;
  updateMLTStatus: (mltId: string, status: string) => Promise<void>;
  deleteMLT: (mltId: string, permanent?: boolean) => Promise<void>;
  resetMLTPassword: (mltId: string, newPassword: string) => Promise<void>;
  getMLTById: (mltId: string) => Promise<MLT | null>;
  updateMLTProfile: (
    mltId: string,
    profileData: Partial<AddMLTData>,
  ) => Promise<void>;
}

const AdminMLTContext = createContext<AdminMLTContextType | undefined>(
  undefined,
);

export const AdminMLTProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mlts, setMLTs] = useState<MLT[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchMLTs = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllMLTs();
      if (response.success) {
        setMLTs(response.data);
      }
    } catch (error: any) {
      console.error("Fetch MLTs error:", error);
      toast.error(error.response?.data?.error || "Failed to fetch MLTs");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminService.getMLTStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error("Fetch MLT stats error:", error);
    }
  };

  const addMLT = async (mltData: AddMLTData) => {
    try {
      setLoading(true);

      // Validate password
      if (!mltData.password || mltData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      console.log("🚀 Calling adminService.addMLT with:", {
        ...mltData,
        password: "[REDACTED]",
      });

      const response = await adminService.addMLT(mltData);

      console.log("✅ Response from server:", response);

      if (response.success) {
        toast.success(
          <div>
            <p className="font-bold">MLT added successfully!</p>
            <p className="text-sm">
              They can now login with the provided password.
            </p>
          </div>,
          { duration: 5000 },
        );

        await fetchMLTs();
        await fetchStats();
      }
    } catch (error: any) {
      console.error("❌ Add MLT error:", error);

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to add MLT";

      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }

      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateMLTStatus = async (mltId: string, status: string) => {
    try {
      setLoading(true);
      const response = await adminService.updateMLTStatus(mltId, status);
      if (response.success) {
        toast.success(`MLT status updated to ${status}`);
        await fetchMLTs();
        await fetchStats();
      }
    } catch (error: any) {
      console.error("Update MLT status error:", error);
      toast.error(error.response?.data?.error || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const deleteMLT = async (mltId: string, permanent: boolean = false) => {
    try {
      setLoading(true);
      const response = await adminService.deleteMLT(mltId, permanent);
      if (response.success) {
        toast.success(
          permanent ? "MLT permanently deleted" : "MLT deactivated",
        );
        await fetchMLTs();
        await fetchStats();
      }
    } catch (error: any) {
      console.error("Delete MLT error:", error);
      toast.error(error.response?.data?.error || "Failed to delete MLT");
    } finally {
      setLoading(false);
    }
  };

  const resetMLTPassword = async (mltId: string, newPassword: string) => {
    try {
      setLoading(true);

      if (!newPassword || newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      const response = await adminService.resetMLTPassword(mltId, newPassword);

      if (response.success) {
        toast.success(
          <div>
            <p className="font-bold">Password reset successfully!</p>
            <p className="text-sm">MLT can now login with the new password.</p>
          </div>,
          { duration: 5000 },
        );
      }
    } catch (error: any) {
      console.error("Reset MLT password error:", error);
      toast.error(error.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const getMLTById = async (mltId: string): Promise<MLT | null> => {
    try {
      const response = await adminService.getMLTById(mltId);
      if (response.success) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Get MLT by ID error:", error);
      return null;
    }
  };

  const updateMLTProfile = async (
    mltId: string,
    profileData: Partial<AddMLTData>,
  ) => {
    try {
      setLoading(true);
      const response = await adminService.updateMLTProfile(mltId, profileData);
      if (response.success) {
        toast.success("MLT profile updated successfully");
        await fetchMLTs();
      }
    } catch (error: any) {
      console.error("Update MLT profile error:", error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    if (user?.role === "admin") {
      fetchMLTs();
      fetchStats();
    }
  }, [user]);

  return (
    <AdminMLTContext.Provider
      value={{
        mlts,
        loading,
        stats,
        fetchMLTs,
        fetchStats,
        addMLT,
        updateMLTStatus,
        deleteMLT,
        resetMLTPassword,
        getMLTById,
        updateMLTProfile,
      }}
    >
      {children}
    </AdminMLTContext.Provider>
  );
};

export const useAdminMLT = () => {
  const context = useContext(AdminMLTContext);
  if (context === undefined) {
    throw new Error("useAdminMLT must be used within an AdminMLTProvider");
  }
  return context;
};
