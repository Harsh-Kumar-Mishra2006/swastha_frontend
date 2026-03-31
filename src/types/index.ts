// types/index.ts
export type UserRole = 'patient' | 'doctor' | 'admin' | 'MLT';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  role: 'patient' | 'doctor' | 'admin' | 'MLT';
  profile: UserProfile;
  isVerified: boolean;
  doctorProfile?: DoctorProfile;
  mltProfile?: MLTProfile;
}

export const isValidRole = (role: string): role is UserRole => {
  return ['patient', 'doctor', 'admin', 'MLT'].includes(role);
};

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
  // MLT fields
  licenseNumber?: string;
  department?: string;
  // Patient fields
  diseases?: Disease[];
  currentMedications?: Medication[];
  allergies?: string[];
  bloodGroup?: string;
  pulseRate?: string;
  emergencyContact?: EmergencyContact;
}

export interface DoctorProfile {
  id: string;
  name: string;
  email: string;
  specialization: string;
  qualifications: string;
  experience: string;
  consultationFee: number;
  availableDays: string[];
  availableTime: {
    start: string;
    end: string;
  };
  status: string;
  bio?: string;
  phone?: string;
}

export interface MLTProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  qualifications: string;
  experience: string;
  licenseNumber: string;
  department: string;
  status: string;
  bio?: string;
  createdAt?: string;
  addedBy?: {
    name: string;
    email: string;
  };
}

export interface MLT {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  qualifications: string;
  experience: string;
  licenseNumber: string;
  department: string;
  bio: string;
  status: 'active' | 'inactive' | 'pending';
  addedBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface AddMLTData {
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  specialization: string;
  qualifications: string;
  experience: string;
  licenseNumber: string;
  department: string;
  bio?: string;
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
  role: 'patient' | 'doctor' | 'admin' | 'MLT';
  age?: string;
  gender?: string;
  dob?: string;
}

export interface AuthResponse {
  success: boolean;
  data: string; // token
  user: {
    id: string;
    name: string;
    email: string;
    username: string;
    phone: string;
    role: string;
    profile: UserProfile;
    isVerified: boolean;
    doctorProfile?: DoctorProfile;
    mltProfile?: MLTProfile;
  };
  message: string;
}