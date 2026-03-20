export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  role: 'patient' | 'doctor' | 'admin';
  profile: UserProfile;
  isVerified: boolean;
}

export interface UserProfile {
  age?: string;
  gender?: string;
  dob?: string;
  address?: string;
  // Doctor fields
  bio?: string;
  specialization?: string;
  qualifications?: string;
  experience?: string;
  // Patient fields
  diseases?: Disease[];
  currentMedications?: Medication[];
  allergies?: string[];
  bloodGroup?: string;
  pulseRate?: string;
  emergencyContact?: EmergencyContact;
}

export interface Disease {
  name: string;
  diagnosedDate: Date;
  status: 'ongoing' | 'recovered' | 'managed';
  notes?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface LoginCredentials {
  email?: string;
  username?: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  username: string;
  phone: string;
  password: string;
  role: 'patient' | 'doctor' | 'admin';
  age?: string;
  gender?: string;
  dob?: string;
}

export interface AuthResponse {
  success: boolean;
  data: string; // token
  user: User;
  message: string;
}