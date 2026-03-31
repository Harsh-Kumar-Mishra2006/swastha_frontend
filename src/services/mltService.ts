// services/mltService.ts
import api from './api';
import { type MLT,type AddMLTData } from '../types';

class MLTService {
  // Add new MLT
  async addMLT(data: AddMLTData): Promise<{ success: boolean; message: string; data: any }> {
    try {
      const response = await api.post('/admin/mlt', data);
      return response.data;
    } catch (error: any) {
      console.error('Add MLT error:', error.response?.data);
      throw error;
    }
  }

  // Get all MLTs
  async getAllMLTs(): Promise<{ success: boolean; data: MLT[] }> {
    try {
      const response = await api.get('/admin/mlt');
      return response.data;
    } catch (error: any) {
      console.error('Get all MLTs error:', error.response?.data);
      throw error;
    }
  }

  // Get MLT by ID
  async getMLTById(mltId: string): Promise<{ success: boolean; data: MLT }> {
    try {
      const response = await api.get(`/admin/mlt/${mltId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get MLT by ID error:', error.response?.data);
      throw error;
    }
  }

  // Update MLT status
  async updateMLTStatus(mltId: string, status: string): Promise<{ success: boolean; message: string; data: MLT }> {
    try {
      const response = await api.put(`/admin/mlt/${mltId}/status`, { status });
      return response.data;
    } catch (error: any) {
      console.error('Update MLT status error:', error.response?.data);
      throw error;
    }
  }

  // Update MLT profile
  async updateMLTProfile(mltId: string, data: Partial<MLT>): Promise<{ success: boolean; message: string; data: MLT }> {
    try {
      const response = await api.put(`/admin/mlt/${mltId}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Update MLT profile error:', error.response?.data);
      throw error;
    }
  }

  // Delete MLT
  async deleteMLT(mltId: string, permanent: boolean = false): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/admin/mlt/${mltId}?permanent=${permanent}`);
      return response.data;
    } catch (error: any) {
      console.error('Delete MLT error:', error.response?.data);
      throw error;
    }
  }

  // Reset MLT password
  async resetMLTPassword(mltId: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`/admin/mlt/${mltId}/reset-password`, { newPassword });
      return response.data;
    } catch (error: any) {
      console.error('Reset MLT password error:', error.response?.data);
      throw error;
    }
  }

  // Get MLT statistics
  async getMLTStats(): Promise<{ success: boolean; data: any }> {
    try {
      const response = await api.get('/admin/mlt/stats');
      return response.data;
    } catch (error: any) {
      console.error('Get MLT stats error:', error.response?.data);
      throw error;
    }
  }
}

export default new MLTService();