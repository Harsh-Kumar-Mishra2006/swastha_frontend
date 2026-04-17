// utils/slipGenerator.ts
import { ConfirmedAppointment } from '../types/appointments';

export const generateAppointmentSlipHTML = (appointment: ConfirmedAppointment): string => {
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
      <title>Appointment Slip - ${appointment.appointmentId}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 40px 20px;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          font-size: 28px;
          margin-bottom: 10px;
        }
        .header p {
          opacity: 0.9;
          font-size: 14px;
        }
        .content {
          padding: 30px;
        }
        .info-section {
          margin-bottom: 30px;
        }
        .info-section h3 {
          color: #0d9488;
          border-bottom: 2px solid #0d9488;
          padding-bottom: 10px;
          margin-bottom: 20px;
          font-size: 18px;
        }
        .info-row {
          display: flex;
          margin-bottom: 15px;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .info-label {
          width: 140px;
          font-weight: 600;
          color: #4b5563;
        }
        .info-value {
          flex: 1;
          color: #1f2937;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .status-confirmed {
          background: #d1fae5;
          color: #065f46;
        }
        .status-completed {
          background: #dbeafe;
          color: #1e40af;
        }
        .footer {
          background: #f9fafb;
          padding: 20px 30px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
          font-size: 12px;
          color: #6b7280;
        }
        .qr-section {
          text-align: center;
          margin-top: 20px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 8px;
        }
        @media print {
          body {
            background: white;
            padding: 0;
          }
          .container {
            box-shadow: none;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏥 Appointment Slip</h1>
          <p>Healthcare Appointment Confirmation</p>
        </div>
        
        <div class="content">
          <div class="info-section">
            <h3>📋 Appointment Details</h3>
            <div class="info-row">
              <div class="info-label">Appointment ID:</div>
              <div class="info-value">${appointment.appointmentId}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Status:</div>
              <div class="info-value">
                <span class="status-badge status-${appointment.status}">${appointment.status}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">Date:</div>
              <div class="info-value">${formatDate(appointment.appointmentDate)}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Time:</div>
              <div class="info-value">${formatTime(appointment.appointmentTime.slot)}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Type:</div>
              <div class="info-value">${appointment.appointmentType === 'visit' ? 'Clinic Visit' : 'Online Consultation'}</div>
            </div>
          </div>

          <div class="info-section">
            <h3>👨‍⚕️ Doctor Information</h3>
            <div class="info-row">
              <div class="info-label">Doctor Name:</div>
              <div class="info-value">Dr. ${appointment.doctor.name}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Specialization:</div>
              <div class="info-value">${appointment.doctor.specialization}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Experience:</div>
              <div class="info-value">${appointment.doctor.experience || 'N/A'} years</div>
            </div>
          </div>

          <div class="info-section">
            <h3>👤 Patient Information</h3>
            <div class="info-row">
              <div class="info-label">Patient Name:</div>
              <div class="info-value">${appointment.patient.name}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Reason for Visit:</div>
              <div class="info-value">${appointment.reasonForVisit}</div>
            </div>
          </div>

          <div class="info-section">
            <h3>💰 Payment Details</h3>
            <div class="info-row">
              <div class="info-label">Consultation Fee:</div>
              <div class="info-value">₹${appointment.consultationFee}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Total Paid:</div>
              <div class="info-value">₹${appointment.totalAmount || appointment.consultationFee}</div>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>This is a computer-generated document. No signature is required.</p>
          <p>Please arrive 15 minutes before your appointment time.</p>
          <p>For any queries, contact: support@healthapp.com | +91 1234567890</p>
        </div>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #0d9488; color: white; border: none; border-radius: 8px; cursor: pointer; margin: 0 10px;">
          🖨️ Print Slip
        </button>
      </div>
    </body>
    </html>
  `;
};