// services/paymentService.ts
import api from './api';

class PaymentService {
  // Create payment order after appointment booking
  async createPaymentOrder(appointmentId: string) {
    const response = await api.post('/payments/create-order', { appointmentId });
    return response.data;
  }

  // Get payment status
  async getPaymentStatus(orderId: string) {
    const response = await api.get(`/payments/status/${orderId}`);
    return response.data;
  }

  // Get all payments for patient
  async getMyPayments(page: number = 1, limit: number = 10) {
    const response = await api.get('/payments/my-payments', {
      params: { page, limit }
    });
    return response.data;
  }

  // Download payment receipt (PDF)
  async downloadPaymentReceipt(appointmentId: string) {
    const response = await api.get(`/payments/receipt/${appointmentId}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  // Open payment receipt in new tab
  async openPaymentReceipt(appointmentId: string) {
    const response = await api.get(`/payments/receipt/${appointmentId}`, {
      responseType: 'blob'
    });
    
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  // Verify payment (redirect callback)
  getPaymentVerifyUrl(orderId: string) {
    // Use Vite's environment variables
    const apiUrl = import.meta.env.VITE_API_URL || '';
    return `${apiUrl}/payments/verify?order_id=${orderId}`;
  }
}

export default new PaymentService();