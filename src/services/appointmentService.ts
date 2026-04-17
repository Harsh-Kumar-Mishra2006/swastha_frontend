// services/appointmentService.ts
import api from './api';
import type { 
  AppointmentData,
  PendingAppointmentResponse,
  PendingAppointmentWithPayment,
  ConfirmedAppointment,
  AppointmentListResponse,
  UploadReportsResponse,
  CancelAppointmentResponse
} from '../types/appointments';  // Fixed: changed from 'appointments' to 'appointment'

class AppointmentService {
  // Check doctor availability for a specific slot
  async checkAvailability(doctorId: string, date: string, timeSlot: string) {
    const response = await api.get('/appointments/check-availability', {
      params: { doctorId, date, timeSlot }
    });
    return response.data;
  }

  // Get doctor details for booking form
  async getDoctorBookingForm(doctorId: string) {
    const response = await api.get(`/appointments/book-form/${doctorId}`);
    return response.data;
  }

  // Create pending appointment (before payment)
  async createPendingAppointment(appointmentData: AppointmentData): Promise<{ success: boolean; data: PendingAppointmentResponse }> {
    const response = await api.post('/appointments/create-pending', appointmentData);
    return response.data;
  }

  // Get pending appointment with payment details
  async getPendingAppointmentWithPayment(appointmentId: string): Promise<{ success: boolean; data: PendingAppointmentWithPayment }> {
    const response = await api.get(`/appointments/pending-payment/${appointmentId}`);
    return response.data;
  }

  // Get confirmed appointment details after payment
  async getConfirmedAppointment(appointmentId: string): Promise<{ success: boolean; data: ConfirmedAppointment }> {
    const response = await api.get(`/appointments/confirmed/${appointmentId}`);
    return response.data;
  }

  // Get all appointments for patient
  // Get all appointments for patient
// Get all appointments for patient
async getMyAppointments(status?: string, page: number = 1, limit: number = 10): Promise<AppointmentListResponse> {
  const response = await api.get('/appointments/my-appointments', {
    params: { status, page, limit }
  });
  
  // Normalize the response to always have data, pagination, and success
  let normalizedResponse: AppointmentListResponse;
  
  // If response.data is already an array
  if (Array.isArray(response.data)) {
    normalizedResponse = {
      success: true,
      data: response.data,
      pagination: {
        page: page,
        limit: limit,
        total: response.data.length,
        pages: Math.ceil(response.data.length / limit)
      }
    };
  } 
  // If response.data has data and pagination
  else if (response.data && typeof response.data === 'object') {
    normalizedResponse = {
      success: response.data.success !== undefined ? response.data.success : true,
      data: response.data.data || [],
      pagination: response.data.pagination || {
        page: page,
        limit: limit,
        total: 0,
        pages: 1
      }
    };
  } 
  // Fallback
  else {
    normalizedResponse = {
      success: false,
      data: [],
      pagination: {
        page: page,
        limit: limit,
        total: 0,
        pages: 1
      }
    };
  }
  
  return normalizedResponse;
}

  // Cancel appointment (no refund)
  async cancelAppointment(appointmentId: string): Promise<CancelAppointmentResponse> {
    const response = await api.put(`/appointments/cancel/${appointmentId}`);
    return response.data;
  }

  // Upload medical reports
  async uploadReports(appointmentId: string, files: File[]): Promise<UploadReportsResponse> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('reports', file);
    });

    const response = await api.post(`/appointments/upload-reports/${appointmentId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export default new AppointmentService();