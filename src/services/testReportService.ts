// services/testReportService.ts
import api from './api';
import { type CreateTestRequestData, type TestReport } from '../types/testReport';

class TestReportService {
  // Doctor: Create test request
  async createTestRequest(data: CreateTestRequestData): Promise<{ success: boolean; data: TestReport; message: string }> {
    const response = await api.post('/test-reports/create', data);
    return response.data;
  }

  // Doctor: Get all test requests
  async getDoctorTestRequests(doctorId: string, status?: string): Promise<{ success: boolean; data: TestReport[]; statistics: any }> {
    const url = status ? `/test-reports/doctor/${doctorId}?status=${status}` : `/test-reports/doctor/${doctorId}`;
    const response = await api.get(url);
    return response.data;
  }

  // MLT: Get assigned test requests
  async getMLTTestRequests(mltId: string, status?: string): Promise<{ success: boolean; data: TestReport[]; statistics: any }> {
    const url = status ? `/test-reports/mlt/${mltId}?status=${status}` : `/test-reports/mlt/${mltId}`;
    const response = await api.get(url);
    return response.data;
  }

  // MLT: Accept assignment
  async acceptAssignment(testId: string, mlt_notes?: string): Promise<{ success: boolean; data: TestReport }> {
    const response = await api.put(`/test-reports/${testId}/accept`, { mlt_notes: mlt_notes || 'Accepted assignment' });
    return response.data;
  }

  // MLT: Reject assignment
  async rejectAssignment(testId: string, rejection_reason: string): Promise<{ success: boolean; data: TestReport }> {
    const response = await api.put(`/test-reports/${testId}/reject`, { rejection_reason });
    return response.data;
  }

  // MLT: Start test
  async startTest(testId: string, mlt_notes?: string): Promise<{ success: boolean; data: TestReport }> {
    const response = await api.put(`/test-reports/${testId}/start`, { mlt_notes: mlt_notes || 'Started working on test' });
    return response.data;
  }

  // MLT: Submit test results
  async submitTestResults(testId: string, data: {
    test_results: string;
    results_summary?: string;
    test_conclusion?: string;
    recommendations?: string;
    mlt_notes?: string;
    test_report_file?: File;
  }): Promise<{ success: boolean; data: TestReport }> {
    const formData = new FormData();
    formData.append('test_results', data.test_results);
    if (data.results_summary) formData.append('results_summary', data.results_summary);
    if (data.test_conclusion) formData.append('test_conclusion', data.test_conclusion);
    if (data.recommendations) formData.append('recommendations', data.recommendations);
    if (data.mlt_notes) formData.append('mlt_notes', data.mlt_notes);
    if (data.test_report_file) formData.append('test_report_file', data.test_report_file);

    const response = await api.put(`/test-reports/${testId}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  // Get test details
  async getTestDetails(testId: string): Promise<{ success: boolean; data: TestReport }> {
    const response = await api.get(`/test-reports/${testId}`);
    return response.data;
  }

  // Doctor: Get patients list
  async getPatientsForDoctor(doctorId: string): Promise<{ success: boolean; data: any[] }> {
    const response = await api.get(`/test-reports/doctor/${doctorId}/patients`);
    return response.data;
  }

  // Get all MLTs (for admin)
  async getMLTs(): Promise<{ success: boolean; data: any[] }> {
    const response = await api.get('/admin/mlt');
    return response.data;
  }

  // 📌 PUBLIC: Get all test reports (No authentication required)
  async getPublicTestReports(status?: string, category?: string, search?: string): Promise<{ success: boolean; data: TestReport[]; statistics: any }> {
    let url = '/test-reports/public/all';
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await api.get(url);
    return response.data;
  }

    // 📌 PUBLIC: Get single test report by ID
  async getPublicTestReport(testId: string): Promise<{ success: boolean; data: TestReport }> {
    const response = await api.get(`/test-reports/public/${testId}`);
    return response.data;
  }

  // 📌 PUBLIC: Get test statistics
  async getPublicTestStatistics(): Promise<{ success: boolean; data: any }> {
    const response = await api.get('/test-reports/public/stats/overview');
    return response.data;
  }

}

export default new TestReportService();