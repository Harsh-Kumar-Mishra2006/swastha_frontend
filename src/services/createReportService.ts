// services/testReportService.ts
import api from './api';
import {
  type TestReport,
  type CreateReportData,
  type MLTStatistics,
  type MLTDashboardData,
  type AssignedTestsResponse,
  type ReportHistory
} from '../types/createReport';

class TestReportService {
  // ============================================
  // MLT DASHBOARD & OVERVIEW
  // ============================================

  /**
   * Get MLT Dashboard Overview
   */
  async getMLTDashboard(mltId: string): Promise<{ success: boolean; data: MLTDashboardData }> {
    const response = await api.get(`/mlt-reports/dashboard/${mltId}`);
    return response.data;
  }

  /**
   * Get MLT Statistics
   */
  async getMLTStatistics(
    mltId: string,
    period?: 'week' | 'month' | 'year'
  ): Promise<{ success: boolean; data: MLTStatistics }> {
    const url = period ? `/mlt-reports/${mltId}/statistics?period=${period}` : `/mlt-reports/${mltId}/statistics`;
    const response = await api.get(url);
    return response.data;
  }

  // ============================================
  // ASSIGNED TESTS
  // ============================================

  /**
   * Get Assigned Tests with filters
   */
  async getAssignedTests(
    mltId: string,
    filters?: {
      status?: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
      category?: string;
      priority?: 'routine' | 'urgent' | 'emergency';
      search?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<{ success: boolean; data: AssignedTestsResponse }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    const url = `/mlt-reports/assigned/${mltId}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  }

  /**
   * Accept Test Assignment
   */
  async acceptAssignment(testId: string, mlt_notes?: string): Promise<{ success: boolean; data: TestReport }> {
    const response = await api.put(`/mlt-reports/${testId}/accept`, { mlt_notes });
    return response.data;
  }

  /**
   * Reject Test Assignment
   */
  async rejectAssignment(testId: string, rejection_reason: string): Promise<{ success: boolean; data: TestReport }> {
    const response = await api.put(`/mlt-reports/${testId}/reject`, { rejection_reason });
    return response.data;
  }

  /**
   * Start Test
   */
  async startTest(testId: string, mlt_notes?: string): Promise<{ success: boolean; data: TestReport }> {
    const response = await api.put(`/mlt-reports/${testId}/start`, { mlt_notes });
    return response.data;
  }

  // ============================================
  // REPORT CREATION & SUBMISSION
  // ============================================

  /**
   * Create Detailed Report
   */
  async createDetailedReport(
    testId: string,
    data: CreateReportData
  ): Promise<{ success: boolean; message: string; data: TestReport }> {
    const formData = new FormData();
    
    // Add all fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'test_report_file' && value instanceof File) {
        formData.append(key, value);
      } else if (key === 'test_parameters' || key === 'normal_ranges') {
        // Convert arrays to JSON strings
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await api.put(`/mlt-reports/${testId}/report`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Submit Test Results (Simple)
   */
  async submitTestResults(
    testId: string,
    data: {
      test_results: string;
      results_summary: string;
      test_conclusion: string;
      recommendations: string;
      mlt_notes: string;
      test_report_file?: File;
    }
  ): Promise<{ success: boolean; data: TestReport }> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'test_report_file' && value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await api.put(`/mlt-reports/${testId}/submit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // ============================================
  // REPORT VIEWING
  // ============================================

  /**
   * Get Test Report Details
   */
  async getTestReport(testId: string): Promise<{ success: boolean; data: TestReport }> {
    const response = await api.get(`/mlt-reports/${testId}`);
    return response.data;
  }

  /**
   * Get Completed Reports (MLT's work)
   */
  async getCompletedReports(
    mltId: string,
    filters?: {
      startDate?: string;
      endDate?: string;
      category?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<{ success: boolean; data: { reports: TestReport[]; summary: any; pagination: any } }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    const url = `/mlt-reports/completed/${mltId}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  }

  // ============================================
  // REPORT HISTORY
  // ============================================

  /**
   * Get Report Version History
   */
  async getReportHistory(testId: string): Promise<{ success: boolean; data: ReportHistory }> {
    const response = await api.get(`/mlt-reports/${testId}/history`);
    return response.data;
  }

  // ============================================
  // PUBLIC ROUTES
  // ============================================

  /**
   * Get Public Test Report (No auth)
   */
  async getPublicTestReport(testId: string): Promise<{ success: boolean; data: TestReport }> {
    const response = await api.get(`/test-reports/public/${testId}`);
    return response.data;
  }

  /**
   * Get All Test Reports (Public)
   */
  async getAllTestReports(filters?: {
    status?: string;
    category?: string;
    search?: string;
  }): Promise<{ success: boolean; statistics: any; data: TestReport[] }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const url = `/test-reports/public/all${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  }

  /**
   * Get Public Statistics
   */
  async getPublicStatistics(): Promise<{ success: boolean; data: any }> {
    const response = await api.get('/test-reports/public/stats/overview');
    return response.data;
  }

  // ============================================
  // DOCTOR ROUTES (for creating test requests)
  // ============================================

  /**
   * Create Test Request (Doctor)
   */
  async createTestRequest(data: any): Promise<{ success: boolean; data: TestReport }> {
    const response = await api.post('/test-reports/create', data);
    return response.data;
  }

  /**
   * Get Doctor's Test Requests
   */
  async getDoctorTestRequests(
    doctorId: string,
    filters?: { status?: string; category?: string; patientId?: string }
  ): Promise<{ success: boolean; statistics: any; data: TestReport[] }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const url = `/test-reports/doctor/${doctorId}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  }
}

export default new TestReportService();