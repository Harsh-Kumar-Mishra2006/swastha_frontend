// services/appointmentService.ts
import api from './api';
import { type AppointmentData, type AppointmentResponse } from '../types/appointments';

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
  async createPendingAppointment(appointmentData: AppointmentData) {
    const response = await api.post('/appointments/create-pending', appointmentData);
    return response.data;
  }

  // Get confirmed appointment details after payment
  async getConfirmedAppointment(appointmentId: string) {
    const response = await api.get(`/appointments/confirmed/${appointmentId}`);
    return response.data;
  }

  // Get all appointments for patient
  async getMyAppointments(status?: string, page: number = 1, limit: number = 10) {
    const response = await api.get('/appointments/my-appointments', {
      params: { status, page, limit }
    });
    return response.data;
  }

  // Cancel appointment (no refund)
  async cancelAppointment(appointmentId: string) {
    const response = await api.put(`/appointments/cancel/${appointmentId}`);
    return response.data;
  }

  // Upload medical reports
  async uploadReports(appointmentId: string, files: File[]) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('reports', file);
    });

    const response = await api.post(`/appointments/upload-reports/${appointmentId}`, 
      formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }
}

export default new AppointmentService();