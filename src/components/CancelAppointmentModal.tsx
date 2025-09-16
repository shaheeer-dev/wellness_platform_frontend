import React, { useState } from 'react';
import './CancelAppointmentModal.css';

interface CancelAppointmentModalProps {
  isOpen: boolean;
  appointmentType: string;
  clientName: string;
  scheduledAt: string;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
}

const CancelAppointmentModal: React.FC<CancelAppointmentModalProps> = ({
  isOpen,
  appointmentType,
  clientName,
  scheduledAt,
  onConfirm,
  onCancel
}) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(reason.trim() || undefined);
    setReason('');
  };

  const handleCancel = () => {
    onCancel();
    setReason('');
  };

  return (
    <div className="modal-overlay">
      <div className="cancel-modal">
        <div className="cancel-modal-header">
          <h3>Cancel Appointment</h3>
          <button 
            className="close-button"
            onClick={handleCancel}
          >
            ✕
          </button>
        </div>

        <div className="cancel-modal-content">
          <div className="cancel-warning">
            <span className="warning-icon">⚠️</span>
            <p>Are you sure you want to cancel this appointment?</p>
          </div>

          <div className="appointment-details">
            <div className="detail-row">
              <span className="label">Client:</span>
              <span className="value">{clientName}</span>
            </div>
            <div className="detail-row">
              <span className="label">Type:</span>
              <span className="value">{appointmentType}</span>
            </div>
            <div className="detail-row">
              <span className="label">Scheduled:</span>
              <span className="value">{scheduledAt}</span>
            </div>
          </div>

          <div className="reason-section">
            <label htmlFor="cancellation-reason">
              Reason for cancellation (optional):
            </label>
            <textarea
              id="cancellation-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for cancelling..."
              rows={3}
              className="reason-input"
            />
          </div>
        </div>

        <div className="cancel-modal-actions">
          <button 
            className="cancel-button-secondary"
            onClick={handleCancel}
          >
            Keep Appointment
          </button>
          <button 
            className="confirm-cancel-button"
            onClick={handleConfirm}
          >
            Yes, Cancel Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelAppointmentModal;
