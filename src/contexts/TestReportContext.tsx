// contexts/TestReportContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "../hooks/useAuth";
import testReportService from "../services/testReportService";
import toast from "react-hot-toast";
import type {
  TestReport,
  CreateReportData,
  UpdateReportData,
  UpdateTestResultData,
  AvailableMLT,
} from "../types/testReport";

interface TestReportContextType {
  // State
  reports: TestReport[];
  currentReport: TestReport | null;
  availableMLTs: AvailableMLT[];
  loading: boolean;
  totalPages: number;
  currentPage: number;

  // Doctor actions
  createReport: (data: CreateReportData) => Promise<TestReport | null>;
  getDoctorReports: (status?: string, page?: number) => Promise<void>;
  getDoctorReportById: (reportId: string) => Promise<TestReport | null>;
  updateDoctorReport: (
    reportId: string,
    data: UpdateReportData,
  ) => Promise<void>;
  assignToMLT: (reportId: string, mltId: string) => Promise<void>;

  // MLT actions
  getMLTReports: (status?: string, page?: number) => Promise<void>;
  getMLTReportById: (reportId: string) => Promise<TestReport | null>;
  acceptReport: (reportId: string) => Promise<void>;
  updateTestResult: (
    reportId: string,
    testIndex: number,
    data: UpdateTestResultData,
  ) => Promise<void>;
  completeReport: (reportId: string) => Promise<void>;

  // Shared actions
  getAvailableMLTs: () => Promise<void>;
  clearCurrentReport: () => void;
  refreshReports: () => Promise<void>;
}

const TestReportContext = createContext<TestReportContextType | undefined>(
  undefined,
);

export const TestReportProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [reports, setReports] = useState<TestReport[]>([]);
  const [currentReport, setCurrentReport] = useState<TestReport | null>(null);
  const [availableMLTs, setAvailableMLTs] = useState<AvailableMLT[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();

  const userRole = user?.role;

  // ==================== DOCTOR ACTIONS ====================

  const createReport = async (
    data: CreateReportData,
  ): Promise<TestReport | null> => {
    try {
      setLoading(true);
      const response = await testReportService.createReport(data);
      if (response.success) {
        toast.success(response.message || "Test report created successfully");
        await getDoctorReports();
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error("Create report error:", error);
      toast.error(error.response?.data?.error || "Failed to create report");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getDoctorReports = async (status?: string, page: number = 1) => {
    try {
      setLoading(true);
      const response = await testReportService.getDoctorReports(status, page);
      if (response.success) {
        setReports(response.data);
        setTotalPages(response.pagination.pages);
        setCurrentPage(response.pagination.page);
      }
    } catch (error: any) {
      console.error("Get doctor reports error:", error);
      toast.error(error.response?.data?.error || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const getDoctorReportById = async (
    reportId: string,
  ): Promise<TestReport | null> => {
    try {
      setLoading(true);
      const response = await testReportService.getDoctorReportById(reportId);
      if (response.success) {
        setCurrentReport(response.data);
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error("Get doctor report error:", error);
      toast.error(error.response?.data?.error || "Failed to fetch report");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateDoctorReport = async (
    reportId: string,
    data: UpdateReportData,
  ) => {
    try {
      setLoading(true);
      const response = await testReportService.updateDoctorReport(
        reportId,
        data,
      );
      if (response.success) {
        toast.success("Report updated successfully");
        setCurrentReport(response.data);
        await getDoctorReports();
      }
    } catch (error: any) {
      console.error("Update report error:", error);
      toast.error(error.response?.data?.error || "Failed to update report");
    } finally {
      setLoading(false);
    }
  };

  const assignToMLT = async (reportId: string, mltId: string) => {
    try {
      setLoading(true);
      const response = await testReportService.assignToMLT(reportId, { mltId });
      if (response.success) {
        toast.success(
          response.message || "Report assigned to MLT successfully",
        );
        await getDoctorReports();
        if (currentReport?._id === reportId) {
          setCurrentReport(response.data);
        }
      }
    } catch (error: any) {
      console.error("Assign to MLT error:", error);
      toast.error(error.response?.data?.error || "Failed to assign report");
    } finally {
      setLoading(false);
    }
  };

  // ==================== MLT ACTIONS ====================

  const getMLTReports = async (status?: string, page: number = 1) => {
    try {
      setLoading(true);
      const response = await testReportService.getMLTReports(status, page);
      if (response.success) {
        setReports(response.data);
        setTotalPages(response.pagination.pages);
        setCurrentPage(response.pagination.page);
      }
    } catch (error: any) {
      console.error("Get MLT reports error:", error);
      toast.error(error.response?.data?.error || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const getMLTReportById = async (
    reportId: string,
  ): Promise<TestReport | null> => {
    try {
      setLoading(true);
      const response = await testReportService.getMLTReportById(reportId);
      if (response.success) {
        setCurrentReport(response.data);
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error("Get MLT report error:", error);
      toast.error(error.response?.data?.error || "Failed to fetch report");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const acceptReport = async (reportId: string) => {
    try {
      setLoading(true);
      const response = await testReportService.acceptReport(reportId);
      if (response.success) {
        toast.success("Report accepted successfully");
        await getMLTReports();
        if (currentReport?._id === reportId) {
          setCurrentReport(response.data);
        }
      }
    } catch (error: any) {
      console.error("Accept report error:", error);
      toast.error(error.response?.data?.error || "Failed to accept report");
    } finally {
      setLoading(false);
    }
  };

  const updateTestResult = async (
    reportId: string,
    testIndex: number,
    data: UpdateTestResultData,
  ) => {
    try {
      setLoading(true);
      const response = await testReportService.updateTestResult(
        reportId,
        testIndex,
        data,
      );
      if (response.success) {
        toast.success("Test result updated successfully");
        setCurrentReport(response.data);
        await getMLTReports();
      }
    } catch (error: any) {
      console.error("Update test result error:", error);
      toast.error(
        error.response?.data?.error || "Failed to update test result",
      );
    } finally {
      setLoading(false);
    }
  };

  const completeReport = async (reportId: string) => {
    try {
      setLoading(true);
      const response = await testReportService.completeReport(reportId);
      if (response.success) {
        toast.success(response.message || "Report completed successfully");
        await getMLTReports();
        if (currentReport?._id === reportId) {
          setCurrentReport(response.data);
        }
      }
    } catch (error: any) {
      console.error("Complete report error:", error);
      toast.error(error.response?.data?.error || "Failed to complete report");
    } finally {
      setLoading(false);
    }
  };

  // ==================== SHARED ACTIONS ====================

  const getAvailableMLTs = async () => {
    try {
      const response = await testReportService.getAvailableMLTs();
      if (response.success) {
        setAvailableMLTs(response.data);
      }
    } catch (error: any) {
      console.error("Get available MLTs error:", error);
      toast.error(
        error.response?.data?.error || "Failed to fetch available MLTs",
      );
    }
  };

  const clearCurrentReport = () => {
    setCurrentReport(null);
  };

  const refreshReports = async () => {
    if (userRole === "doctor") {
      await getDoctorReports();
    } else if (userRole === "MLT") {
      await getMLTReports();
    }
  };

  return (
    <TestReportContext.Provider
      value={{
        // State
        reports,
        currentReport,
        availableMLTs,
        loading,
        totalPages,
        currentPage,

        // Doctor actions
        createReport,
        getDoctorReports,
        getDoctorReportById,
        updateDoctorReport,
        assignToMLT,

        // MLT actions
        getMLTReports,
        getMLTReportById,
        acceptReport,
        updateTestResult,
        completeReport,

        // Shared actions
        getAvailableMLTs,
        clearCurrentReport,
        refreshReports,
      }}
    >
      {children}
    </TestReportContext.Provider>
  );
};

export const useTestReport = () => {
  const context = useContext(TestReportContext);
  if (context === undefined) {
    throw new Error("useTestReport must be used within a TestReportProvider");
  }
  return context;
};
