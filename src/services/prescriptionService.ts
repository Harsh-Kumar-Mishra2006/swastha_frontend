// src/services/prescriptionService.ts

import axios from 'axios';
import {
  Prescription,
  CreatePrescriptionRequest,
  UpdatePrescriptionRequest,
  DispensePrescriptionRequest,
  PrescriptionStats,
  ApiResponse
} from '../types/prescription';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class PrescriptionService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  /**
   * Create a new prescription (Doctor only)
   */
  async createPrescription(data: CreatePrescriptionRequest): Promise<ApiResponse<Prescription>> {
    try {
      const response = await axios.post(
        `${API_URL}/prescriptions/create`,
        data,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create prescription'
      };
    }
  }

  /**
   * Get prescriptions for a patient
   */
  async getPatientPrescriptions(
    patientEmail: string,
    status?: string
  ): Promise<ApiResponse<Prescription[]>> {
    try {
      const url = status
        ? `${API_URL}/prescriptions/patient/${patientEmail}?status=${status}`
        : `${API_URL}/prescriptions/patient/${patientEmail}`;
      const response = await axios.get(url, this.getAuthHeaders());
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch prescriptions'
      };
    }
  }

  /**
   * Get prescriptions for a doctor
   */
  async getDoctorPrescriptions(
    doctorEmail: string,
    status?: string
  ): Promise<ApiResponse<Prescription[]>> {
    try {
      const url = status
        ? `${API_URL}/prescriptions/doctor/${doctorEmail}?status=${status}`
        : `${API_URL}/prescriptions/doctor/${doctorEmail}`;
      const response = await axios.get(url, this.getAuthHeaders());
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch prescriptions'
      };
    }
  }

  /**
   * Get prescription details by ID
   */
  async getPrescriptionDetails(prescriptionId: string): Promise<ApiResponse<Prescription>> {
    try {
      const response = await axios.get(
        `${API_URL}/prescriptions/${prescriptionId}`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch prescription details'
      };
    }
  }

  /**
   * Update prescription (Doctor only)
   */
  async updatePrescription(
    prescriptionId: string,
    data: UpdatePrescriptionRequest
  ): Promise<ApiResponse<Prescription>> {
    try {
      const response = await axios.put(
        `${API_URL}/prescriptions/${prescriptionId}`,
        data,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update prescription'
      };
    }
  }

  /**
   * Dispense prescription (Pharmacy/Admin)
   */
  async dispensePrescription(
    prescriptionId: string,
    data: DispensePrescriptionRequest
  ): Promise<ApiResponse<Prescription>> {
    try {
      const response = await axios.put(
        `${API_URL}/prescriptions/${prescriptionId}/dispense`,
        data,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to dispense prescription'
      };
    }
  }

  /**
   * Cancel prescription (Doctor/Admin)
   */
  async cancelPrescription(
    prescriptionId: string,
    reason: string
  ): Promise<ApiResponse<Prescription>> {
    try {
      const response = await axios.put(
        `${API_URL}/prescriptions/${prescriptionId}/cancel`,
        { reason },
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to cancel prescription'
      };
    }
  }

  /**
   * Get prescription statistics (Admin only)
   */
  async getPrescriptionStats(): Promise<ApiResponse<PrescriptionStats>> {
    try {
      const response = await axios.get(
        `${API_URL}/prescriptions/admin/stats`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch statistics'
      };
    }
  }
}

export default new PrescriptionService();