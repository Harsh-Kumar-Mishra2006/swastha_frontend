// services/appointmentService.ts
import api from './api';
import { type Appointment, type BookAppointmentData, type DoctorAvailability } from '../types/appointments';

class AppointmentService {
  // Book appointment with payment screenshot
  async bookAppointment(data: BookAppointmentData): Promise<{ success: boolean; data: Appointment; message: string }> {
    const formData = new FormData();
    formData.append('patient_email', data.patient_email);
    formData.append('patient_name', data.patient_name);
    formData.append('patient_phone', data.patient_phone);
    formData.append('doctor_email', data.doctor_email);
    formData.append('doctor_name', data.doctor_name);
    formData.append('doctor_specialization', data.doctor_specialization);
    formData.append('appointment_date', data.appointment_date);
    formData.append('appointment_time', data.appointment_time);
    formData.append('symptoms', data.symptoms);
    formData.append('notes', data.notes);
    formData.append('amount', data.amount.toString());
    formData.append('payment_screenshot', data.payment_screenshot);

    const response = await api.post('/appointments/book', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Get available doctors
  async getAvailableDoctors(): Promise<{ success: boolean; data: DoctorAvailability[] }> {
    const response = await api.get('/appointments/available-doctors');
    return response.data;
  }

  // Get patient appointments
  async getPatientAppointments(email: string): Promise<{ success: boolean; data: Appointment[] }> {
    const response = await api.get(`/appointments/patient/${email}`);
    return response.data;
  }

  // Get doctor appointments (for doctor portal)
  async getDoctorAppointments(email: string, status?: string): Promise<{ success: boolean; data: Appointment[]; statistics?: any }> {
    const url = status ? `/appointments/doctor/${email}?status=${status}` : `/appointments/doctor/${email}`;
    const response = await api.get(url);
    return response.data;
  }

  // Get appointment details
  async getAppointmentDetails(id: string): Promise<{ success: boolean; data: Appointment }> {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  }

  // Approve appointment (doctor)
  async approveAppointment(id: string, doctor_notes?: string): Promise<{ success: boolean; data: Appointment }> {
    const response = await api.put(`/appointments/${id}/approve`, { doctor_notes });
    return response.data;
  }

  // Reject appointment (doctor)
  async rejectAppointment(id: string, rejection_reason: string, doctor_notes?: string): Promise<{ success: boolean; data: Appointment }> {
    const response = await api.put(`/appointments/${id}/reject`, { rejection_reason, doctor_notes });
    return response.data;
  }

  // Cancel appointment (patient)
  async cancelAppointment(id: string, patient_email: string): Promise<{ success: boolean; data: Appointment }> {
    const response = await api.put(`/appointments/${id}/cancel`, { patient_email });
    return response.data;
  }

  // Verify payment (admin)
  async verifyPayment(id: string): Promise<{ success: boolean; data: Appointment }> {
    const response = await api.put(`/appointments/${id}/verify-payment`);
    return response.data;
  }

  // Get appointment statistics (admin)
  async getAppointmentStats(): Promise<{ success: boolean; data: any }> {
    const response = await api.get('/appointments/admin/stats');
    return response.data;
  }
}

export default new AppointmentService();