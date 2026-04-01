// contexts/MLTContext.tsx
import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import mltService from "../services/mltService";
import { type MLT, type AddMLTData } from "../types";

interface MLTContextType {
  mlts: MLT[];
  loading: boolean;
  fetchMLTs: () => Promise<void>;
  addMLT: (data: AddMLTData) => Promise<void>;
  updateMLTStatus: (mltId: string, status: string) => Promise<void>;
  deleteMLT: (mltId: string, permanent: boolean) => Promise<void>;
  resetMLTPassword: (mltId: string, newPassword: string) => Promise<void>;
}

const MLTContext = createContext<MLTContextType | undefined>(undefined);

export const useMLT = () => {
  const context = useContext(MLTContext);
  if (!context) {
    throw new Error("useMLT must be used within a MLTProvider");
  }
  return context;
};

export const MLTProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mlts, setMLTs] = useState<MLT[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMLTs = async () => {
    try {
      setLoading(true);
      const response = await mltService.getAllMLTs();
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

  const addMLT = async (data: AddMLTData) => {
    try {
      setLoading(true);
      const response = await mltService.addMLT(data);
      if (response.success) {
        toast.success(response.message || "MLT added successfully!");
        await fetchMLTs(); // Refresh the list
      }
    } catch (error: any) {
      console.error("Add MLT error:", error);
      toast.error(error.response?.data?.error || "Failed to add MLT");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateMLTStatus = async (mltId: string, status: string) => {
    try {
      setLoading(true);
      const response = await mltService.updateMLTStatus(mltId, status);
      if (response.success) {
        toast.success(
          `MLT ${status === "active" ? "activated" : "deactivated"} successfully`,
        );
        await fetchMLTs(); // Refresh the list
      }
    } catch (error: any) {
      console.error("Update MLT status error:", error);
      toast.error(error.response?.data?.error || "Failed to update status");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteMLT = async (mltId: string, permanent: boolean = false) => {
    try {
      setLoading(true);
      const response = await mltService.deleteMLT(mltId, permanent);
      if (response.success) {
        toast.success(response.message || "MLT deleted successfully");
        await fetchMLTs(); // Refresh the list
      }
    } catch (error: any) {
      console.error("Delete MLT error:", error);
      toast.error(error.response?.data?.error || "Failed to delete MLT");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetMLTPassword = async (mltId: string, newPassword: string) => {
    try {
      setLoading(true);
      const response = await mltService.resetMLTPassword(mltId, newPassword);
      if (response.success) {
        toast.success("Password reset successfully");
      }
    } catch (error: any) {
      console.error("Reset MLT password error:", error);
      toast.error(error.response?.data?.error || "Failed to reset password");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <MLTContext.Provider
      value={{
        mlts,
        loading,
        fetchMLTs,
        addMLT,
        updateMLTStatus,
        deleteMLT,
        resetMLTPassword,
      }}
    >
      {children}
    </MLTContext.Provider>
  );
};
