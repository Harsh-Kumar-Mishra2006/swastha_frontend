// utils/slipGenerator.ts
export const generateAppointmentSlipHTML = (appointment: any): string => {
  // Safe data extraction with fallbacks
  const appointmentId = appointment?.appointmentId || appointment?._id || 'N/A';
  const status = appointment?.status || 'pending';
  const appointmentDate = appointment?.appointmentDate || new Date().toISOString();
  
  // Handle appointmentTime safely
  let timeSlot = 'N/A';
  if (appointment?.appointmentTime) {
    if (typeof appointment.appointmentTime === 'string') {
      timeSlot = appointment.appointmentTime;
    } else if (appointment.appointmentTime.slot) {
      timeSlot = appointment.appointmentTime.slot;
    }
  }
  
  // Handle appointment type
  const appointmentType = appointment?.appointmentType || 'visit';
  const typeText = appointmentType === 'visit' ? 'Clinic Visit' : 'Online Consultation';
  
  // Handle doctor info safely
  const doctorName = appointment?.doctor?.name || appointment?.doctorName || 'N/A';
  const doctorSpecialization = appointment?.doctor?.specialization || appointment?.specialization || 'N/A';
  const doctorExperience = appointment?.doctor?.experience || appointment?.experience || appointment?.doctor?.yearsOfExperience || 'N/A';
  
  // Handle patient info safely
  const patientName = appointment?.patient?.name || appointment?.patientName || 'N/A';
  const reasonForVisit = appointment?.reasonForVisit || 'Not specified';
  
  // Handle payment info safely
  const consultationFee = appointment?.doctor?.consultationFee || appointment?.consultationFee || 500;
  const convenienceFee = Math.round(Number(consultationFee) * 0.02);
  const totalAmount = Number(consultationFee) + convenienceFee;
  const paymentStatus = appointment?.paymentStatus || 'paid';

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Date not available';
    }
  };

  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch {
      return time;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'status-confirmed';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Appointment Slip - ${appointmentId}</title>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          background: #f0fdf4;
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
        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }
        .status-cancelled {
          background: #fee2e2;
          color: #991b1b;
        }
        .footer {
          background: #f9fafb;
          padding: 20px 30px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
          font-size: 12px;
          color: #6b7280;
        }
        .button-container {
          text-align: center;
          margin-top: 20px;
          padding: 20px;
        }
        button {
          padding: 10px 20px;
          background: #0d9488;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin: 0 10px;
          font-size: 14px;
        }
        button:hover {
          background: #0f766e;
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
              <div class="info-value">${appointmentId}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Status:</div>
              <div class="info-value">
                <span class="status-badge ${getStatusColor(status)}">${status.toUpperCase()}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">Date:</div>
              <div class="info-value">${formatDate(appointmentDate)}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Time:</div>
              <div class="info-value">${formatTime(timeSlot)}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Type:</div>
              <div class="info-value">${typeText}</div>
            </div>
          </div>

          <div class="info-section">
            <h3>👨‍⚕️ Doctor Information</h3>
            <div class="info-row">
              <div class="info-label">Doctor Name:</div>
              <div class="info-value">Dr. ${doctorName}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Specialization:</div>
              <div class="info-value">${doctorSpecialization}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Experience:</div>
              <div class="info-value">${doctorExperience} years</div>
            </div>
          </div>

          <div class="info-section">
            <h3>👤 Patient Information</h3>
            <div class="info-row">
              <div class="info-label">Patient Name:</div>
              <div class="info-value">${patientName}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Reason for Visit:</div>
              <div class="info-value">${reasonForVisit}</div>
            </div>
          </div>

          <div class="info-section">
            <h3>💰 Payment Details</h3>
            <div class="info-row">
              <div class="info-label">Consultation Fee:</div>
              <div class="info-value">₹${consultationFee}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Convenience Fee (2%):</div>
              <div class="info-value">₹${convenienceFee}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Total Amount:</div>
              <div class="info-value"><strong>₹${totalAmount}</strong></div>
            </div>
            <div class="info-row">
              <div class="info-label">Payment Status:</div>
              <div class="info-value">${paymentStatus.toUpperCase()}</div>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>This is a computer-generated document. No signature is required.</p>
          <p>Please arrive 15 minutes before your appointment time.</p>
          <p>For any queries, contact: support@healthapp.com | +91 1234567890</p>
        </div>
      </div>
      
      <div class="button-container no-print">
        <button onclick="window.print()">🖨️ Print Slip</button>
        <button onclick="window.close()">❌ Close</button>
      </div>
    </body>
    </html>
  `;
};