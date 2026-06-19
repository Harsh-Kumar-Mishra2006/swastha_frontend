// services/testReportService.ts
import api from './api';
import {type CreateTestRequestData, type TestReport } from '../types/testReport';

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

  // Doctor: Get patients list
  async getPatientsForDoctor(doctorId: string): Promise<{ success: boolean; data: any[] }> {
    const response = await api.get(`/test-reports/doctor/${doctorId}/patients`);
    return response.data;
  }

  // Get all MLTs (for dropdown)
  async getMLTs(): Promise<{ success: boolean; data: any[] }> {
    const response = await api.get('/admin/mlt');
    return response.data;
  }

  // Get test details
  async getTestDetails(testId: string): Promise<{ success: boolean; data: TestReport }> {
    const response = await api.get(`/test-reports/${testId}`);
    return response.data;
  }
}

export default new TestReportService();