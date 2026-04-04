// services/testReportService.ts
import api from './api';
import type {
  CreateReportData,
  UpdateReportData,
  AssignMLTData,
  UpdateTestResultData,
  ReportListResponse,
  ReportResponse,
  AvailableMLT
} from '../types/testReport';

class TestReportService {
  // ==================== DOCTOR ENDPOINTS ====================
  
  // Create new test report
  async createReport(data: CreateReportData): Promise<ReportResponse> {
    const response = await api.post('/reports/create', data);
    return response.data;
  }

  // Get all reports created by doctor
  async getDoctorReports(status?: string, page: number = 1, limit: number = 20): Promise<ReportListResponse> {
    const response = await api.get('/reports/doctor/my-reports', {
      params: { status, page, limit }
    });
    return response.data;
  }

  // Get single report by ID (doctor view)
  async getDoctorReportById(reportId: string): Promise<ReportResponse> {
    const response = await api.get(`/reports/doctor/${reportId}`);
    return response.data;
  }

  // Update report (doctor)
  async updateDoctorReport(reportId: string, data: UpdateReportData): Promise<ReportResponse> {
    const response = await api.put(`/reports/doctor/${reportId}`, data);
    return response.data;
  }

  // Assign report to MLT
  async assignToMLT(reportId: string, data: AssignMLTData): Promise<ReportResponse> {
    const response = await api.post(`/reports/doctor/${reportId}/assign`, data);
    return response.data;
  }

  // ==================== MLT ENDPOINTS ====================
  
  // Get all reports assigned to MLT
  async getMLTReports(status?: string, page: number = 1, limit: number = 20): Promise<ReportListResponse> {
    const response = await api.get('/reports/mlt/my-reports', {
      params: { status, page, limit }
    });
    return response.data;
  }

  // Get single report by ID (MLT view)
  async getMLTReportById(reportId: string): Promise<ReportResponse> {
    const response = await api.get(`/reports/mlt/${reportId}`);
    return response.data;
  }

  // Accept report assignment
  async acceptReport(reportId: string): Promise<ReportResponse> {
    const response = await api.put(`/reports/mlt/${reportId}/accept`);
    return response.data;
  }

  // Update test result
  async updateTestResult(reportId: string, testIndex: number, data: UpdateTestResultData): Promise<ReportResponse> {
    const response = await api.put(`/reports/mlt/${reportId}/tests/${testIndex}`, data);
    return response.data;
  }

  // Complete report
  async completeReport(reportId: string): Promise<ReportResponse> {
    const response = await api.put(`/reports/mlt/${reportId}/complete`);
    return response.data;
  }

  // ==================== SHARED ENDPOINTS ====================
  
  // Get report by ID (auto-detects role)
  async getReportById(reportId: string): Promise<ReportResponse> {
    const response = await api.get(`/reports/${reportId}`);
    return response.data;
  }

  // Get available MLTs for assignment
  async getAvailableMLTs(): Promise<{ success: boolean; data: AvailableMLT[] }> {
    const response = await api.get('/reports/available-mlts');
    return response.data;
  }
}

export default new TestReportService();