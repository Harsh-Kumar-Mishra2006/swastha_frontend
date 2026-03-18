// types/payment.ts
export interface CashfreeDetails {
  orderToken: string;
  paymentLink: string;
  paymentSessionId: string;
}

export interface PaymentOrderResponse {
  paymentId: string;
  orderId: string;
  amount: number;
  consultationFee: number;
  convenienceFee: number;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  cashfree: CashfreeDetails;
}

export interface PaymentStatus {
  paymentId: string;
  orderId: string;
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'created' | 'pending' | 'success' | 'failure';
  appointmentId: string;
  appointmentStatus?: string;
  doctorName: string;
  patientName: string;
  transactionDetails?: {
    transactionId: string;
    bankReference?: string;
    paymentTime: string;
    paymentMode: string;
    upiId?: string;
  };
  paymentDate?: string;
}

export interface PaymentListItem {
  paymentId: string;
  orderId: string;
  amount: number;
  paymentStatus: string;
  doctorName: string;
  paymentDate: string;
  appointmentId: string;
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