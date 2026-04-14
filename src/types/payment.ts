// types/payment.ts

export interface QRPaymentDetails {
  upiId: string;
  upiName: string;
  amount: number;
  consultationFee: number;
  convenienceFee: number;
  qrCodeUrl: string;
  instructions: string[];
}

export interface UploadPaymentScreenshotData {
  appointmentId: string;
  transactionId: string;
  transactionReference?: string;
  paymentTime?: string;
  screenshot: File;
}

export interface UploadPaymentResponse {
  success: boolean;
  message: string;
  data: {
    paymentId: string;
    paymentStatus: string;
    message: string;
  };
}

export interface PaymentStatus {
  paymentId: string;
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'rejected';
  appointmentId: string;
  appointmentStatus?: string;
  doctorName: string;
  patientName: string;
  uploadedScreenshot?: {
    fileName: string;
    fileUrl: string;
    uploadedAt: string;
  };
  verificationStatus: 'under_review' | 'verified' | 'rejected';
  verificationNotes?: string;
  paymentDate?: string;
}

export interface PaymentListItem {
  paymentId: string;
  amount: number;
  paymentStatus: string;
  doctorName: string;
  paymentDate: string;
  appointmentId: string;
  verificationStatus: string;
}

export interface PaymentListResponse {
  success: boolean;
  data: PaymentListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Admin types
export interface PendingPayment {
  paymentId: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  amount: number;
  transactionId: string;
  screenshotUrl: string;
  uploadedAt: string;
  appointmentId: string;
}

export interface PendingPaymentListResponse {
  success: boolean;
  data: PendingPayment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface VerifyPaymentData {
  action: 'approve' | 'reject';
  notes?: string;
}