// services/paymentService.ts
import api from './api';
import type { 
  QRPaymentDetails, 
  UploadPaymentResponse, 
  PaymentStatus,
  PaymentListResponse,
  PendingPaymentListResponse,
  VerifyPaymentData
} from '../types/payment';

class PaymentService {
  // Get QR code payment details
  async getQRPaymentDetails(appointmentId: string) {
  const response = await api.get('/payments/qr-details', {
    params: { appointmentId }
  });
  return response.data;
}

  // Upload payment screenshot
  async uploadPaymentScreenshot(
    appointmentId: string,
    screenshot: File,
    transactionId: string,
    transactionReference?: string,
    paymentTime?: string
  ): Promise<UploadPaymentResponse> {
    const formData = new FormData();
    formData.append('screenshot', screenshot);
    formData.append('appointmentId', appointmentId);
    formData.append('transactionId', transactionId);
    if (transactionReference) {
      formData.append('transactionReference', transactionReference);
    }
    if (paymentTime) {
      formData.append('paymentTime', paymentTime);
    }

    const response = await api.post(`/payments/upload-screenshot/${appointmentId}`, formData);
    return response.data;
  }

  // Get payment status by appointment ID
  async getPaymentStatus(appointmentId: string): Promise<{ success: boolean; data: PaymentStatus }> {
    const response = await api.get(`/payments/status/${appointmentId}`);
    return response.data;
  }

  // Get all payments for patient
  async getMyPayments(page: number = 1, limit: number = 10): Promise<PaymentListResponse> {
    const response = await api.get('/payments/my-payments', {
      params: { page, limit }
    });
    return response.data;
  }

  // Admin: Get all pending payments
  async getPendingPayments(page: number = 1, limit: number = 20): Promise<PendingPaymentListResponse> {
    const response = await api.get('/payments/admin/pending', {
      params: { page, limit }
    });
    return response.data;
  }

  // Admin: Verify payment and confirm appointment
  async verifyPayment(paymentId: string, data: VerifyPaymentData): Promise<{ success: boolean; message: string }> {
    const response = await api.put(`/payments/admin/verify-payment/${paymentId}`, data);
    return response.data;
  }
}

export default new PaymentService();