// types/appointment.ts

export interface DoctorBookingInfo {
  doctorId: string;
  doctorName: string;
  specialization: string;
  consultationFee: number;
  experience?: number;
}

export interface AppointmentData {
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: 'visit' | 'online';
  reasonForVisit: string;
  symptoms?: string[];
  diseaseDetails?: {
    primaryDisease: string;
    duration: string;
    severity: 'mild' | 'moderate' | 'severe';
  };
  isFirstVisit: boolean;
  additionalNotes?: string;
}

export interface PendingAppointmentResponse {
  appointmentId: string;
  appointmentIdDisplay: string;
  doctorName: string;
  consultationFee: number;
  convenienceFee: number;
  totalAmount: number;
  expiresAt: string;
}

export interface PendingAppointmentWithPayment {
  appointmentId: string;
  appointmentIdDisplay: string;
  doctor: {
    name: string;
    specialization: string;
    consultationFee: number;
  };
  appointmentDate: string;
  appointmentTime: {
    slot: string;
    duration: number;
  };
  reasonForVisit: string;
  paymentDetails: {
    consultationFee: number;
    convenienceFee: number;
    totalAmount: number;
    status: 'not_started' | 'pending' | 'paid' | 'rejected';
    paymentId?: string;
  };
  expiresAt: string;
}

export interface ConfirmedAppointment {
  appointmentId: string;
  appointmentDate: string;
  appointmentTime: {
    slot: string;
    duration: number;
  };
  doctor: {
    name: string;
    specialization: string;
  };
  patient: {
    name: string;
    age: number;
    gender: string;
  };
  status: 'confirmed';
  paymentDetails?: {
    paymentId: string;
    amount: number;
    paymentStatus: string;
    paymentDate: string;
  };
  reasonForVisit: string;
}

export interface AppointmentListItem {
  appointmentId: string;
  doctorName: string;
  specialization: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'expired';
  bookingType: 'direct' | 'paid';
  reasonForVisit: string;
}

export interface AppointmentListResponse {
  success: boolean;
  data: AppointmentListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Report upload
export interface UploadedReport {
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}