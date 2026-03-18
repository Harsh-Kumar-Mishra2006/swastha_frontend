// hooks/usePayment.ts
import { useState } from 'react';
import paymentService from '../services/paymentService';
import toast from 'react-hot-toast';
import { type PaymentOrderResponse, type PaymentStatus } from '../types/payment';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [paymentOrder, setPaymentOrder] = useState<PaymentOrderResponse | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);

  const createPaymentOrder = async (appointmentId: string) => {
    try {
      setLoading(true);
      const response = await paymentService.createPaymentOrder(appointmentId);
      
      if (response.success) {
        setPaymentOrder(response.data);
        toast.success('Payment order created! Redirecting to payment...', {
          duration: 3000,
        });
        return response.data;
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        if (error.response.data.error?.includes('expired')) {
          toast.error('Appointment expired. Please book again.');
        } else {
          toast.error(error.response.data.error || 'Failed to create payment order');
        }
      } else {
        toast.error('Failed to create payment order. Please try again.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const redirectToPayment = (paymentData: PaymentOrderResponse) => {
    // Open Cashfree payment page
    if (paymentData.cashfree.paymentLink) {
      window.open(paymentData.cashfree.paymentLink, '_self');
    } else {
      toast.error('Payment link not available');
    }
  };

  const checkPaymentStatus = async (orderId: string) => {
    try {
      const response = await paymentService.getPaymentStatus(orderId);
      if (response.success) {
        setPaymentStatus(response.data);
        return response.data;
      }
    } catch (error: any) {
      console.error('Error checking payment status:', error);
      return null;
    }
  };

  const pollPaymentStatus = (orderId: string, onSuccess?: () => void) => {
    let attempts = 0;
    const maxAttempts = 30; // 30 attempts * 2 seconds = 60 seconds
    
    const interval = setInterval(async () => {
      attempts++;
      
      const status = await checkPaymentStatus(orderId);
      
      if (status?.paymentStatus === 'paid') {
        clearInterval(interval);
        toast.success('Payment successful! Your appointment is confirmed.', {
          duration: 5000,
          icon: '✅',
        });
        if (onSuccess) onSuccess();
      } else if (status?.paymentStatus === 'failed') {
        clearInterval(interval);
        toast.error('Payment failed. Please try again.');
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        toast.error('Payment verification timeout. Please check your appointments.');
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  };

  const getMyPayments = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await paymentService.getMyPayments(page);
      return response.data;
    } catch (error: any) {
      toast.error('Failed to fetch payment history');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async (appointmentId: string) => {
    try {
      setLoading(true);
      await paymentService.openPaymentReceipt(appointmentId);
      toast.success('Payment receipt opened', { icon: '📄' });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to download receipt');
    } finally {
      setLoading(false);
    }
  };

  const resetPaymentOrder = () => {
    setPaymentOrder(null);
    setPaymentStatus(null);
  };

  return {
    loading,
    paymentOrder,
    paymentStatus,
    createPaymentOrder,
    redirectToPayment,
    checkPaymentStatus,
    pollPaymentStatus,
    getMyPayments,
    downloadReceipt,
    resetPaymentOrder
  };
};