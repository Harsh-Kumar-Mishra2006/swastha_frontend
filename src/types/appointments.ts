// types/appointment.ts
export interface Appointment {
  _id: string;
  patient_email: string;
  patient_name: string;
  patient_phone: string;
  doctor_email: string;
  doctor_name: string;
  doctor_specialization: string;
  appointment_date: string;
  appointment_time: string;
  symptoms: string;
  notes: string;
  amount: number;
  screenshot_url: string;
  screenshot_public_id?: string;
  payment_status: 'pending' | 'verified' | 'failed';
  appointment_status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';
  doctor_notes: string;
  rejection_reason: string;
  approval_date?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookAppointmentData {
  patient_email: string;
  patient_name: string;
  patient_phone: string;
  doctor_email: string;
  doctor_name: string;
  doctor_specialization: string;
  appointment_date: string;
  appointment_time: string;
  symptoms: string;
  notes: string;
  amount: number;
  payment_screenshot: File;
}

export interface DoctorAvailability {
  id: string;
  name: string;
  email: string;
  specialization: string;
  consultationFee: number;
  availableDays: string[];
  availableTime: {
    start: string;
    end: string;
  };
}