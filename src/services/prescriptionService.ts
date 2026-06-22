// services/prescriptionService.ts
import axios from 'axios';
import {
  type Prescription,
  type CreatePrescriptionRequest,
  type UpdatePrescriptionRequest,
  type PrescriptionStats,
  type ApiResponse
} from '../types/prescription';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const prescriptionService = {
  // 📌 Create Prescription (Doctor)
  createPrescription: async (
    data: CreatePrescriptionRequest
  ): Promise<ApiResponse<Prescription>> => {
    try {
      const response = await api.post('/prescription/create', data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error creating prescription:', error);
      throw error.response?.data || { error: 'Failed to create prescription' };
    }
  },

  // 📌 Get Patient Prescriptions
  getPatientPrescriptions: async (
    patientEmail: string,
    status?: string
  ): Promise<ApiResponse<Prescription[]>> => {
    try {
      const url = status
        ? `/prescription/patient/${patientEmail}?status=${status}`
        : `/prescription/patient/${patientEmail}`;
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching patient prescriptions:', error);
      throw error.response?.data || { error: 'Failed to fetch prescriptions' };
    }
  },

  // 📌 Get Doctor Prescriptions
  getDoctorPrescriptions: async (
    doctorEmail: string,
    status?: string
  ): Promise<ApiResponse<Prescription[]>> => {
    try {
      const url = status
        ? `/prescription/doctor/${doctorEmail}?status=${status}`
        : `/prescription/doctor/${doctorEmail}`;
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching doctor prescriptions:', error);
      throw error.response?.data || { error: 'Failed to fetch prescriptions' };
    }
  },

  // 📌 Get Prescription Details
  getPrescriptionDetails: async (
    prescriptionId: string
  ): Promise<ApiResponse<Prescription>> => {
    try {
      const response = await api.get(`/prescription/${prescriptionId}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching prescription details:', error);
      throw error.response?.data || { error: 'Failed to fetch prescription details' };
    }
  },

  // 📌 Update Prescription (Doctor)
  updatePrescription: async (
    prescriptionId: string,
    data: UpdatePrescriptionRequest
  ): Promise<ApiResponse<Prescription>> => {
    try {
      const response = await api.put(`/prescription/${prescriptionId}`, data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error updating prescription:', error);
      throw error.response?.data || { error: 'Failed to update prescription' };
    }
  },

  // 📌 Dispense Prescription (Pharmacy/Admin)
  dispensePrescription: async (
    prescriptionId: string,
    data: { pharmacy_name: string; pharmacist_name: string; notes?: string }
  ): Promise<ApiResponse<Prescription>> => {
    try {
      const response = await api.put(`/prescription/${prescriptionId}/dispense`, data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error dispensing prescription:', error);
      throw error.response?.data || { error: 'Failed to dispense prescription' };
    }
  },

  // 📌 Cancel Prescription (Doctor/Admin)
  cancelPrescription: async (
    prescriptionId: string,
    reason: string
  ): Promise<ApiResponse<Prescription>> => {
    try {
      const response = await api.put(`/prescription/${prescriptionId}/cancel`, { reason });
      return response.data;
    } catch (error: any) {
      console.error('❌ Error cancelling prescription:', error);
      throw error.response?.data || { error: 'Failed to cancel prescription' };
    }
  },

  // 📌 Get Prescription Statistics (Admin)
  getPrescriptionStats: async (): Promise<ApiResponse<PrescriptionStats>> => {
    try {
      const response = await api.get('/prescription/admin/stats');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching prescription stats:', error);
      throw error.response?.data || { error: 'Failed to fetch statistics' };
    }
  },

  // 📌 Get Available Appointments for Prescription (Doctor)
  getAvailableAppointments: async (doctorEmail: string): Promise<ApiResponse<any[]>> => {
    try {
      const response = await api.get(`/appointments/doctor/${doctorEmail}?status=approved`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching available appointments:', error);
      throw error.response?.data || { error: 'Failed to fetch appointments' };
    }
  },
};

export default prescriptionService;