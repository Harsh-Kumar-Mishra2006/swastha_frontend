// utils/slipGenerator.ts
import paymentService from '../services/paymentService';
import {type ConfirmedAppointment } from '../types/appointments';

export const downloadPaymentReceipt = async (appointmentId: string) => {
  try {
    await paymentService.downloadPaymentReceipt(appointmentId);
  } catch (error) {
    console.error('Error downloading receipt:', error);
    throw error;
  }
};

export const openPaymentReceipt = async (appointmentId: string) => {
  try {
    await paymentService.openPaymentReceipt(appointmentId);
  } catch (error) {
    console.error('Error opening receipt:', error);
    throw error;
  }
};

// Optional: Generate a simple HTML appointment slip (client-side only)
export const generateAppointmentInfoHTML = (appointment: ConfirmedAppointment) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Appointment Details</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #0d9488; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .row { display: flex; margin: 10px 0; }
        .label { width: 150px; font-weight: bold; }
        .value { flex: 1; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Appointment Details</h1>
        </div>
        <div class="content">
          <div class="row">
            <div class="label">Appointment ID:</div>
            <div class="value">${appointment.appointmentId}</div>
          </div>
          <div class="row">
            <div class="label">Doctor:</div>
            <div class="value">Dr. ${appointment.doctor.name}</div>
          </div>
          <div class="row">
            <div class="label">Specialization:</div>
            <div class="value">${appointment.doctor.specialization}</div>
          </div>
          <div class="row">
            <div class="label">Date:</div>
            <div class="value">${formatDate(appointment.appointmentDate)}</div>
          </div>
          <div class="row">
            <div class="label">Time:</div>
            <div class="value">${formatTime(appointment.appointmentTime.slot)}</div>
          </div>
          <div class="row">
            <div class="label">Patient:</div>
            <div class="value">${appointment.patient.name}</div>
          </div>
          <div class="row">
            <div class="label">Status:</div>
            <div class="value">${appointment.status}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};