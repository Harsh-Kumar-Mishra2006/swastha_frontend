// hooks/useTestReport.ts
import { useEffect } from 'react';
import { useTestReport } from '../contexts/TestReportContext';
import { useAuth } from './useAuth';

export const useTestReportData = () => {
  const {
    reports,
    currentReport,
    availableMLTs,
    loading,
    totalPages,
    currentPage,
    createReport,
    getDoctorReports,
    getMLTReports,
    getDoctorReportById,
    getMLTReportById,
    updateDoctorReport,
    assignToMLT,
    acceptReport,
    updateTestResult,
    completeReport,
    getAvailableMLTs,
    clearCurrentReport,
    refreshReports
  } = useTestReport();
  
  const { user } = useAuth();
  const userRole = user?.role;

  // Auto-load reports based on role
  useEffect(() => {
    if (userRole === 'doctor') {
      getDoctorReports();
      getAvailableMLTs();
    } else if (userRole === 'MLT') {
      getMLTReports();
    }
  }, [userRole]);

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Helper function to get priority badge color
  const getPriorityColor = (priority: string) => {
    const colors = {
      normal: 'bg-gray-100 text-gray-800',
      urgent: 'bg-orange-100 text-orange-800',
      emergency: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return {
    // Data
    reports,
    currentReport,
    availableMLTs,
    loading,
    totalPages,
    currentPage,
    userRole,
    
    // Helper functions
    getStatusColor,
    getPriorityColor,
    
    // Actions
    createReport,
    getDoctorReports,
    getMLTReports,
    getDoctorReportById,
    getMLTReportById,
    updateDoctorReport,
    assignToMLT,
    acceptReport,
    updateTestResult,
    completeReport,
    getAvailableMLTs,
    clearCurrentReport,
    refreshReports
  };
};