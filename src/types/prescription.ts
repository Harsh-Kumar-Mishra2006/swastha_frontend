// types/prescription.ts

export interface Medication {
  _id?: string;
  medicine_name: string;
  strength: string;
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Cream' | 'Ointment' | 'Drops' | 'Inhaler' | 'Other';
  quantity: string;
  dosage: string;
  frequency: string;
  duration: string;
  timing: 'Before meal' | 'After meal' | 'With meal' | 'Empty stomach' | 'Any time' | '';
  special_instructions: string;
  is_controlled: boolean;
}

export interface Prescription {
  _id: string;
  appointmentId: string | Appointment;
  patientId: string | Patient;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  patient_age: string;
  patient_gender: 'Male' | 'Female' | 'Other' | '';
  patient_bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | '';
  
  doctorId: string | Doctor;
  doctor_name: string;
  doctor_email: string;
  doctor_specialization: string;
  
  diagnosis: string;
  disease: string;
  disease_code: string;
  
  prescription_date: string;
  valid_until: string;
  
  medications: Medication[];
  dispensing_instructions: string;
  refills_allowed: number;
  refills_remaining: number;
  
  patient_instructions: string[];
  non_medication_advice: string;
  lifestyle_advice: string;
  dietary_restrictions: string;
  
  follow_up_required: boolean;
  follow_up_date: string;
  follow_up_notes: string;
  
  warnings: string[];
  allergies_checked: boolean;
  drug_interactions_checked: boolean;
  
  prescription_status: 'draft' | 'active' | 'dispensed' | 'expired' | 'cancelled';
  
  is_digital_signed: boolean;
  digital_signature: string;
  doctor_notes: string;
  
  createdAt: string;
  updatedAt: string;
  dispensed_at: string;
  cancelled_at: string;
  
  // Virtuals
  medication_count?: number;
  is_expired?: boolean;
  age_in_days?: number;
}

export interface Appointment {
  _id: string;
  patient_name: string;
  patient_email: string;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  appointment_status: string;
  doctor_specialization?: string;
}

export interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profile?: {
    age?: string;
    gender?: string;
    bloodGroup?: string;
  };
}

export interface Doctor {
  _id: string;
  name: string;
  email: string;
  profile?: {
    specialization?: string;
  };
}

export interface CreatePrescriptionRequest {
  appointmentId: string;
  diagnosis: string;
  disease: string;
  disease_code?: string;
  medications: Medication[];
  patient_instructions: string[];
  non_medication_advice: string;
  lifestyle_advice: string;
  dietary_restrictions: string;
  follow_up_required: boolean;
  follow_up_date?: string;
  follow_up_notes?: string;
  refills_allowed: number;
  valid_until?: string;
  warnings: string[];
  doctor_notes: string;
}

export interface UpdatePrescriptionRequest {
  diagnosis?: string;
  disease?: string;
  disease_code?: string;
  medications?: Medication[];
  patient_instructions?: string[];
  non_medication_advice?: string;
  lifestyle_advice?: string;
  dietary_restrictions?: string;
  follow_up_required?: boolean;
  follow_up_date?: string;
  follow_up_notes?: string;
  refills_allowed?: number;
  valid_until?: string;
  warnings?: string[];
  doctor_notes?: string;
}

export interface PrescriptionStats {
  total: number;
  active: number;
  dispensed: number;
  expired: number;
  cancelled: number;
  byDoctor: Array<{
    _id: string;
    count: number;
    active: number;
    dispensed: number;
  }>;
  topMedications: Array<{
    _id: string;
    count: number;
  }>;
  last30Days: Array<{
    _id: string;
    count: number;
  }>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
  count?: number;
  statistics?: any;
}