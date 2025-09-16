export interface Client {
  id: string;
  attributes: {
    name: string;
    email: string;
    phone: string;
    external_id: string;
  };
  type: string;
}

export interface Appointment {
  id: string;
  attributes: {
    appointment_type: string;
    scheduled_at: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    notes?: string;
    external_id: string;
  };
  relationships?: {
    client: {
      data: {
        id: string;
        type: string;
      };
    };
  };
  type: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
  };
}

export interface CreateAppointmentRequest {
  appointment: {
    appointment_type: string;
    scheduled_at: string;
    notes?: string;
    status?: 'scheduled' | 'completed' | 'cancelled';
  };
}

export interface ApiError {
  error: {
    type: string;
    message: string;
    details?: any;
    timestamp: string;
  };
}

export interface AppointmentFormProps {
  selectedClient?: Client | null;
  onAppointmentCreated: () => void;
  onClose?: () => void;
}
