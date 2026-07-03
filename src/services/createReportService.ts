// services/createReportService.ts
import api from './api';
import {
  type TestReport,
  type CreateReportData,
  type MLTStatistics,
  type MLTDashboardData,
  type AssignedTestsResponse,
  type ReportHistory,
  type MLTCompletedReportsFilters,
  type DoctorTestRequestFilters,
  type DoctorTestStatistics
} from '../types/testReport';

class TestReportService {
  // ============================================
  // MLT DASHBOARD & OVERVIEW
  // ============================================

  async getMLTDashboard(mltId: string): Promise<{ success: boolean; data: MLTDashboardData }> {
    const response = await api.get(`/mlt-reports/dashboard/${mltId}`);
    return response.data;
  }

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
        if (value !== undefined && value !== null) params.append(key, value.toString());
      });
    }
    const url = `/mlt-reports/assigned/${mltId}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  }

  async acceptAssignment(testId: string, mlt_notes?: string): Promise<{ success: boolean; data: TestReport }> {
    const response = await api.put(`/mlt-reports/${testId}/accept`, { mlt_notes });
    return response.data;
  }

  async rejectAssignment(testId: string, rejection_reason: string): Promise<{ success: boolean; data: TestReport }> {
    const response = await api.put(`/mlt-reports/${testId}/reject`, { rejection_reason });
    return response.data;
  }

  async startTest(testId: string, mlt_notes?: string): Promise<{ success: boolean; data: TestReport }> {
    const response = await api.put(`/mlt-reports/${testId}/start`, { mlt_notes });
    return response.data;
  }

  // ============================================
  // REPORT CREATION & SUBMISSION
  // ============================================

  async createDetailedReport(
    testId: string,
    data: CreateReportData
  ): Promise<{ success: boolean; message: string; data: TestReport }> {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'test_report_file' && value instanceof File) {
        formData.append(key, value);
      } else if ((key === 'test_parameters' || key === 'normal_ranges') && Array.isArray(value)) {
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

  async getTestReport(testId: string): Promise<{ success: boolean; data: TestReport }> {
    const response = await api.get(`/mlt-reports/${testId}`);
    return response.data;
  }

  async getCompletedReports(
    mltId: string,
    filters?: MLTCompletedReportsFilters
  ): Promise<{ success: boolean; data: { reports: TestReport[]; summary: any; pagination: any } }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) params.append(key, value.toString());
      });
    }
    const url = `/mlt-reports/completed/${mltId}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  }

  async getReportHistory(testId: string): Promise<{ success: boolean; data: ReportHistory }> {
    const response = await api.get(`/mlt-reports/${testId}/history`);
    return response.data;
  }

  // ============================================
  // PUBLIC ROUTES
  // ============================================

  async getPublicTestReport(testId: string): Promise<{ success: boolean; data: TestReport }> {
    const response = await api.get(`/test-reports/public/${testId}`);
    return response.data;
  }

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

  async getPublicStatistics(): Promise<{ success: boolean; data: any }> {
    const response = await api.get('/test-reports/public/stats/overview');
    return response.data;
  }

  // ============================================
  // DOCTOR ROUTES
  // ============================================

  async createTestRequest(data: any): Promise<{ success: boolean; data: TestReport }> {
    const response = await api.post('/test-reports/create', data);
    return response.data;
  }

  async getDoctorTestRequests(
    doctorId: string,
    filters?: DoctorTestRequestFilters
  ): Promise<{ success: boolean; statistics: DoctorTestStatistics; data: TestReport[] }> {
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

  async getDoctorCompletedReports(
    doctorId: string,
    filters?: { status?: string; category?: string; patientId?: string }
  ): Promise<{ success: boolean; data: TestReport[] }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    const url = `/test-reports/doctor/${doctorId}/completed-reports${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  }

  async getDoctorTestStatistics(doctorId: string): Promise<{ success: boolean; data: DoctorTestStatistics }> {
    const response = await api.get(`/test-reports/doctor/${doctorId}/statistics`);
    return response.data;
  }

  async getPatientsForDoctor(doctorId: string): Promise<{ success: boolean; data: any[] }> {
    const response = await api.get(`/test-reports/doctor/${doctorId}/patients`);
    return response.data;
  }

  // ============================================
  // SHARED ROUTES
  // ============================================

  async getTestRequestDetails(testId: string): Promise<{ success: boolean; data: TestReport }> {
    const response = await api.get(`/test-reports/${testId}`);
    return response.data;
  }
}

export default new TestReportService();