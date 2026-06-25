// src/types/prescription.ts

export interface Medication {
  medicine_name: string;
  strength: string;
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Cream' | 'Ointment' | 'Drops' | 'Inhaler' | 'Other';
  quantity: string;
  dosage: string;
  frequency: string;
  duration: string;
  timing: 'Before meal' | 'After meal' | 'With meal' | 'Empty stomach' | 'Any time' | '';
  special_instructions?: string;
  is_controlled?: boolean;
}

export interface Prescription {
  _id: string;
  appointmentId: string | AppointmentReference;
  patientId: string | PatientReference;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  patient_age?: string;
  patient_gender?: string;
  patient_bloodGroup?: string;
  doctorId: string | DoctorReference;
  doctor_name: string;
  doctor_email: string;
  doctor_specialization: string;
  diagnosis: string;
  disease: string;
  disease_code?: string;
  prescription_date: Date;
  valid_until: Date;
  medications: Medication[];
  dispensing_instructions?: string;
  refills_allowed: number;
  refills_remaining: number;
  patient_instructions: string[];
  non_medication_advice?: string;
  lifestyle_advice?: string;
  dietary_restrictions?: string;
  follow_up_required: boolean;
  follow_up_date?: Date;
  follow_up_notes?: string;
  warnings: string[];
  allergies_checked: boolean;
  drug_interactions_checked: boolean;
  prescription_status: 'draft' | 'active' | 'dispensed' | 'expired' | 'cancelled';
  is_digital_signed: boolean;
  digital_signature?: string;
  doctor_notes?: string;
  createdAt: Date;
  updatedAt: Date;
  dispensed_at?: Date;
  cancelled_at?: Date;
  // Virtuals
  medication_count?: number;
  is_expired?: boolean;
  age_in_days?: number;
}

export interface AppointmentReference {
  _id: string;
  appointment_date: Date;
  appointment_time: string;
  doctor_name: string;
}

export interface PatientReference {
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

export interface DoctorReference {
  _id: string;
  name: string;
  email: string;
  profile?: {
    specialization?: string;
  };
}

// API Request/Response Types
export interface CreatePrescriptionRequest {
  appointmentId: string;
  diagnosis: string;
  disease: string;
  disease_code?: string;
  medications: Omit<Medication, 'form' | 'timing'> & {
    form?: Medication['form'];
    timing?: Medication['timing'];
  }[];
  patient_instructions: string[];
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
  valid_until?: string;
  refills_allowed?: number;
  warnings?: string[];
  doctor_notes?: string;
}

export interface DispensePrescriptionRequest {
  pharmacy_name?: string;
  pharmacist_name?: string;
  notes?: string;
}

export interface PrescriptionStats {
  total: number;
  active: number;
  dispensed: number;
  expired: number;
  cancelled: number;
  byDoctor: {
    _id: string;
    count: number;
    active: number;
    dispensed: number;
  }[];
  topMedications: {
    _id: string;
    count: number;
  }[];
  last30Days: {
    _id: string;
    count: number;
  }[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  count?: number;
  statistics?: any;
}