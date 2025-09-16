import React, { useState, useEffect } from 'react';
import { AppointmentFormProps } from '../types';
import { appointmentsApi } from '../services/api';
import { APPOINTMENT_TYPES, generateTimeSlots, DEFAULT_FORM_VALUES } from '../constants';
import { getDefaultScheduledDate, getTodayFormatted, combineDateTimeToISO } from '../utils/dateHelpers';
import { useClients, useAsyncOperation } from '../hooks';
import { toast } from 'react-toastify';
import './AppointmentForm.css';

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  selectedClient,
  onAppointmentCreated,
  onClose
}) => {
  const [formData, setFormData] = useState({
    clientId: selectedClient?.id || '',
    appointmentType: '',
    scheduledDate: getDefaultScheduledDate(),
    scheduledTime: DEFAULT_FORM_VALUES.DEFAULT_TIME_SLOT,
    notes: ''
  });
  
  const { clients } = useClients(selectedClient);
  const { loading, error, executeAsync, clearError } = useAsyncOperation();

  useEffect(() => {
    if (selectedClient) {
      setFormData(prev => ({ ...prev, clientId: selectedClient.id }));
    }
  }, [selectedClient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    clearError();
    
    if (!formData.clientId || !formData.appointmentType || !formData.scheduledDate || !formData.scheduledTime) {
      return;
    }

    const scheduledAt = combineDateTimeToISO(formData.scheduledDate, formData.scheduledTime);
    
    const result = await executeAsync(
      () => appointmentsApi.createAppointment(formData.clientId, {
        appointment_type: formData.appointmentType,
        scheduled_at: scheduledAt,
        notes: formData.notes || undefined
      }),
      'Failed to create appointment'
    );


    if (result) {
      setFormData({
        clientId: selectedClient?.id || '',
        appointmentType: '',
        scheduledDate: getDefaultScheduledDate(),
        scheduledTime: DEFAULT_FORM_VALUES.DEFAULT_TIME_SLOT,
        notes: ''
      });

      onAppointmentCreated();
      
      if (onClose) {
        onClose();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Generate time slots dynamically
  const timeSlots = generateTimeSlots();

  return (
    <div className="appointment-form">
      <div className="form-header">
        <h3>Schedule New Appointment</h3>
        {onClose && (
          <button onClick={onClose} className="close-button">
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="clientId">Client *</label>
          {selectedClient ? (
            <div className="selected-client">
              <span className="client-name">{selectedClient.attributes.name}</span>
              <span className="client-email">({selectedClient.attributes.email})</span>
            </div>
          ) : (
            <select
              id="clientId"
              name="clientId"
              value={formData.clientId}
              onChange={handleInputChange}
              required
              className="form-input"
            >
              <option value="">Select a client...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.attributes.name} ({client.attributes.email})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="appointmentType">Appointment Type *</label>
          <select
            id="appointmentType"
            name="appointmentType"
            value={formData.appointmentType}
            onChange={handleInputChange}
            required
            className="form-input"
          >
            <option value="">Select appointment type...</option>
            {APPOINTMENT_TYPES.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="scheduledDate">Date *</label>
            <input
              type="date"
              id="scheduledDate"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleInputChange}
              min={getTodayFormatted()}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="scheduledTime">Time *</label>
            <select
              id="scheduledTime"
              name="scheduledTime"
              value={formData.scheduledTime}
              onChange={handleInputChange}
              required
              className="form-input"
            >
              {timeSlots.map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder={DEFAULT_FORM_VALUES.NOTES_PLACEHOLDER}
            rows={DEFAULT_FORM_VALUES.NOTES_ROWS}
            className="form-input form-textarea"
          />
        </div>

        <div className="form-actions">
          {onClose && (
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          )}
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Scheduling...' : 'Schedule Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
