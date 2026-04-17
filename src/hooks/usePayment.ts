// hooks/usePayment.ts
import { useState } from 'react';
import paymentService from '../services/paymentService';
import toast from 'react-hot-toast';
import { type QRPaymentDetails, type PaymentStatus, type PaymentListItem } from '../types/payment';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [qrDetails, setQrDetails] = useState<QRPaymentDetails | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [payments, setPayments] = useState<PaymentListItem[]>([]);

  // Get QR code payment details
  const getQRPaymentDetails = async (appointmentId: string): Promise<QRPaymentDetails | null> => {
    try {
      setLoading(true);
      const response = await paymentService.getQRPaymentDetails(appointmentId);
      
      if (response.success) {
        setQrDetails(response.data);
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error('Error fetching QR details:', error);
      toast.error(error.response?.data?.error || 'Failed to load payment details');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Upload payment screenshot
  const uploadPaymentScreenshot = async (
    appointmentId: string,
    screenshot: File,
    transactionId: string,
    transactionReference?: string,
    paymentTime?: string
  ) => {
    try {
      setLoading(true);
      const response = await paymentService.uploadPaymentScreenshot(
        appointmentId,
        screenshot,
        transactionId,
        transactionReference,
        paymentTime
      );
      
      if (response.success) {
        toast.success(response.message, {
          duration: 5000,
          icon: '📸',
        });
        return response;
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Failed to upload payment proof';
      toast.error(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get payment status by appointment ID
  const getPaymentStatus = async (appointmentId: string): Promise<PaymentStatus | null> => {
    try {
      setLoading(true);
      const response = await paymentService.getPaymentStatus(appointmentId);
      
      if (response.success) {
        setPaymentStatus(response.data);
        return response.data;
      }
      return null;
    } catch (error: any) {
      console.error('Error fetching payment status:', error);
      // Don't show toast for 404 (no payment found)
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.error || 'Failed to fetch payment status');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get all payments for patient
  const getMyPayments = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      const response = await paymentService.getMyPayments(page, limit);
      
      if (response.success) {
        setPayments(response.data);
        return response;
      }
      return null;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch payment history');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Poll payment status (for manual verification status)
  const pollPaymentStatus = (
    appointmentId: string, 
    onVerified?: () => void,
    onRejected?: () => void,
    intervalTime: number = 5000 // Check every 5 seconds
  ) => {
    let attempts = 0;
    const maxAttempts = 720; // 720 attempts * 5 seconds = 60 minutes
    
    const interval = setInterval(async () => {
      attempts++;
      
      const status = await getPaymentStatus(appointmentId);
      
      if (status?.paymentStatus === 'paid') {
        clearInterval(interval);
        toast.success('Payment verified! Your appointment is confirmed.', {
          duration: 5000,
          icon: '✅',
        });
        if (onVerified) onVerified();
      } else if (status?.paymentStatus === 'rejected') {
        clearInterval(interval);
        toast.error('Payment verification failed. Please contact support.', {
          duration: 5000,
        });
        if (onRejected) onRejected();
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        toast.loading('Verification taking longer than expected. You will be notified via email.', {
          duration: 5000,
        });
      }
    }, intervalTime);

    return () => clearInterval(interval);
  };

  // Reset states
  const resetPaymentState = () => {
    setQrDetails(null);
    setPaymentStatus(null);
  };

  // Admin: Get pending payments
  const getPendingPayments = async (page: number = 1, limit: number = 20) => {
    try {
      setLoading(true);
      const response = await paymentService.getPendingPayments(page, limit);
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch pending payments');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Admin: Verify payment
  const verifyPayment = async (paymentId: string, action: 'approve' | 'reject', notes?: string) => {
    try {
      setLoading(true);
      const response = await paymentService.verifyPayment(paymentId, { action, notes });
      
      if (response.success) {
        toast.success(response.message);
        return response;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to verify payment');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Add these to your existing usePayment hook

const downloadPaymentReceipt = async (appointmentId: string) => {
  try {
    setLoading(true);
    await paymentService.downloadPaymentReceipt(appointmentId);
  } catch (error) {
    console.error('Error downloading receipt:', error);
    throw error;
  } finally {
    setLoading(false);
  }
};

const openPaymentReceipt = async (appointmentId: string) => {
  try {
    setLoading(true);
    await paymentService.openPaymentReceipt(appointmentId);
  } catch (error) {
    console.error('Error opening receipt:', error);
    throw error;
  } finally {
    setLoading(false);
  }
};

const generateAppointmentSlip = async (appointmentId: string) => {
  try {
    setLoading(true);
    await paymentService.generateAppointmentSlip(appointmentId);
  } catch (error) {
    console.error('Error generating appointment slip:', error);
    throw error;
  } finally {
    setLoading(false);
  }
};


  return {
    loading,
    qrDetails,
    paymentStatus,
    payments,
    getQRPaymentDetails,
    uploadPaymentScreenshot,
    getPaymentStatus,
    getMyPayments,
    pollPaymentStatus,
    resetPaymentState,
    // Admin methods
    getPendingPayments,
    verifyPayment,
    downloadPaymentReceipt,  // Add this
    openPaymentReceipt,       // Add this
    generateAppointmentSlip
  };
};