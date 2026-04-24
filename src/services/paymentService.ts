// services/paymentService.ts
import api from './api';
import type { 
  UploadPaymentResponse, 
  PaymentStatus,
  PaymentListResponse,
  PendingPaymentListResponse,
  VerifyPaymentData
} from '../types/payment';
import { toast } from 'react-toastify';
import { generateAppointmentSlipHTML } from '../utils/slipGenerator';

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

    // CORRECT: No appointmentId in URL, send as formData field
    const response = await api.post('/payments/upload-screenshot', formData);
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

  // Add these methods to your existing PaymentService class

// Download payment receipt
async downloadPaymentReceipt(appointmentId: string): Promise<void> {
  try {
    const response = await api.get(`/payments/receipt/${appointmentId}`, {
      responseType: 'blob'
    });
    
    // Create blob and download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `payment_receipt_${appointmentId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    toast.success('Receipt downloaded successfully');
  } catch (error: any) {
    console.error('Error downloading receipt:', error);
    toast.error(error.response?.data?.error || 'Failed to download receipt');
    throw error;
  }
}

// Open payment receipt in new tab
async openPaymentReceipt(appointmentId: string): Promise<void> {
  try {
    const response = await api.get(`/payments/receipt/${appointmentId}`, {
      responseType: 'blob'
    });
    
    // Create blob and open in new tab
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
    
    toast.success('Opening receipt...');
  } catch (error: any) {
    console.error('Error opening receipt:', error);
    toast.error(error.response?.data?.error || 'Failed to open receipt');
    throw error;
  }
}

// Generate appointment slip (client-side HTML)
async generateAppointmentSlip(appointmentId: string): Promise<void> {
  try {
    const response = await api.get(`/appointments/confirmed/${appointmentId}`);
    const appointment = response.data.data;
    
    // Generate HTML content
    const htmlContent = generateAppointmentSlipHTML(appointment);
    
    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `appointment_slip_${appointmentId}.html`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    toast.success('Appointment slip downloaded');
  } catch (error: any) {
    console.error('Error generating appointment slip:', error);
    toast.error(error.response?.data?.error || 'Failed to generate appointment slip');
    throw error;
  }
}
}

export default new PaymentService();