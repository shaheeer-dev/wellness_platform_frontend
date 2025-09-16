import React, { useState, useEffect } from 'react';
import { format, parseISO, isFuture } from 'date-fns';
import { Appointment, Client } from '../types';
import { appointmentsApi } from '../services/api';
import './AppointmentsList.css';

interface AppointmentsListProps {
  selectedClient?: Client | null;
  onAppointmentUpdate?: () => void;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({ selectedClient, onAppointmentUpdate }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    fetchAppointments();
  }, [filter]); // fetchAppointments is stable since it's defined inline

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {};
      if (filter === 'upcoming') {
        params.upcoming = true;
      } else if (filter !== 'all') {
        params.status = filter;
      }
      
      const response = await appointmentsApi.getAppointments(params);
      setAppointments(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to fetch appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: 'completed' | 'cancelled') => {
    try {
      await appointmentsApi.updateAppointment(appointmentId, { status: newStatus });
      fetchAppointments(); // Refresh the list
      onAppointmentUpdate?.();
    } catch (err: any) {
      console.error('Error updating appointment:', err);
      alert('Failed to update appointment status');
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentsApi.cancelAppointment(appointmentId);
        fetchAppointments(); // Refresh the list
        onAppointmentUpdate?.();
      } catch (err: any) {
        console.error('Error cancelling appointment:', err);
        alert('Failed to cancel appointment');
      }
    }
  };

  const getStatusColor = (status: string, scheduledAt: string) => {
    switch (status) {
      case 'completed':
        return '#27ae60';
      case 'cancelled':
        return '#e74c3c';
      case 'scheduled':
        const date = parseISO(scheduledAt);
        return isFuture(date) ? '#3498db' : '#f39c12';
      default:
        return '#7f8c8d';
    }
  };

  const getStatusText = (status: string, scheduledAt: string) => {
    if (status === 'scheduled') {
      const date = parseISO(scheduledAt);
      return isFuture(date) ? 'Upcoming' : 'Overdue';
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (!selectedClient) return true;
    return appointment.relationships?.client?.data?.id === selectedClient.id;
  });

  if (loading && appointments.length === 0) {
    return <div className="appointments-list-loading">Loading appointments...</div>;
  }

  return (
    <div className="appointments-list">
      <div className="appointments-header">
        <h2>
          {selectedClient ? `${selectedClient.attributes.name}'s Appointments` : 'All Appointments'}
        </h2>
        
        <div className="filter-container">
          <label>Filter by status:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">All Appointments</option>
            <option value="upcoming">Upcoming Only</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchAppointments} className="retry-button">
            Retry
          </button>
        </div>
      )}

      <div className="appointments-container">
        {loading && <div className="loading-overlay">Loading...</div>}
        
        {filteredAppointments.length === 0 && !loading && (
          <div className="no-appointments">
            {selectedClient 
              ? `No appointments found for ${selectedClient.attributes.name}.`
              : 'No appointments found.'
            }
          </div>
        )}

        {filteredAppointments.map((appointment) => {
          const scheduledDate = parseISO(appointment.attributes.scheduled_at);
          const statusColor = getStatusColor(appointment.attributes.status, appointment.attributes.scheduled_at);
          const statusText = getStatusText(appointment.attributes.status, appointment.attributes.scheduled_at);

          return (
            <div key={appointment.id} className="appointment-card">
              <div className="appointment-header">
                <div className="appointment-type">
                  {appointment.attributes.appointment_type}
                </div>
                <div 
                  className="appointment-status"
                  style={{ color: statusColor }}
                >
                  {statusText}
                </div>
              </div>
              
              <div className="appointment-details">
                <div className="appointment-time">
                  📅 {format(scheduledDate, 'PPP')} at {format(scheduledDate, 'p')}
                </div>
                
                {appointment.attributes.notes && (
                  <div className="appointment-notes">
                    📝 {appointment.attributes.notes}
                  </div>
                )}
              </div>

              {appointment.attributes.status === 'scheduled' && (
                <div className="appointment-actions">
                  <button
                    onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                    className="action-button complete-button"
                  >
                    Mark Complete
                  </button>
                  <button
                    onClick={() => handleCancelAppointment(appointment.id)}
                    className="action-button cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentsList;
