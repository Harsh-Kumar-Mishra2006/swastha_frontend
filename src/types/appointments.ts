// types/appointment.ts
export interface Appointment {
  _id: string;
  patientId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    profile?: {
      age?: string;
      gender?: string;
      dob?: string;
      address?: string;
      bloodGroup?: string;
      allergies?: string[];
    };
  };  // ✅ Now populated with patient details
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

// ✅ Updated booking data (now includes patientId automatically from server)
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

// ✅ Patient info from appointment
export interface PatientInfo {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profile?: {
    age?: string;
    gender?: string;
    dob?: string;
    address?: string;
    bloodGroup?: string;
    allergies?: string[];
  };
}