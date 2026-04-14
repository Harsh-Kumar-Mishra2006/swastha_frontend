// hooks/useAppointment.ts
import { useState } from 'react';
import appointmentService from '../services/appointmentService';
import toast from 'react-hot-toast';
import { type AppointmentData, type DoctorBookingInfo, type PendingAppointmentWithPayment } from '../types/appointments';

export const useAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [pendingAppointment, setPendingAppointment] = useState<any>(null);

  const checkAvailability = async (doctorId: string, date: string, timeSlot: string) => {
    try {
      setLoading(true);
      const response = await appointmentService.checkAvailability(doctorId, date, timeSlot);
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to check availability');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getDoctorBookingInfo = async (doctorId: string): Promise<DoctorBookingInfo> => {
    try {
      setLoading(true);
      const response = await appointmentService.getDoctorBookingForm(doctorId);
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch doctor details');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createPendingAppointment = async (appointmentData: AppointmentData) => {
    try {
      setLoading(true);
      const response = await appointmentService.createPendingAppointment(appointmentData);
      
      if (response.success) {
        setPendingAppointment(response.data);
        toast.success('Appointment details saved! Proceed to payment.', {
          duration: 4000,
          icon: '📋',
        });
        
        return response.data;
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.error || 'Slot no longer available');
      } else {
        toast.error(error.response?.data?.error || 'Failed to create appointment');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getPendingAppointmentWithPayment = async (appointmentId: string): Promise<PendingAppointmentWithPayment | null> => {
    try {
      setLoading(true);
      const response = await appointmentService.getPendingAppointmentWithPayment(appointmentId);
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch appointment details');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getConfirmedAppointment = async (appointmentId: string) => {
    try {
      setLoading(true);
      const response = await appointmentService.getConfirmedAppointment(appointmentId);
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch appointment');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getMyAppointments = async (status?: string, page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      const response = await appointmentService.getMyAppointments(status, page, limit);
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch appointments');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    try {
      setLoading(true);
      const response = await appointmentService.cancelAppointment(appointmentId);
      // Fix: response has message property directly
      toast.success(response.message || 'Appointment cancelled successfully');
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to cancel appointment');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const uploadReports = async (appointmentId: string, files: File[]) => {
    try {
      setLoading(true);
      const response = await appointmentService.uploadReports(appointmentId, files);
      // Fix: response has message property directly
      toast.success(response.message || 'Reports uploaded successfully');
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to upload reports');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    pendingAppointment,
    checkAvailability,
    getDoctorBookingInfo,
    createPendingAppointment,
    getPendingAppointmentWithPayment,
    getConfirmedAppointment,
    getMyAppointments,
    cancelAppointment,
    uploadReports
  };
};