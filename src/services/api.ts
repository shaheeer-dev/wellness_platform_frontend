import axios from 'axios';
import { Client, Appointment, ApiResponse, CreateAppointmentRequest } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const clientsApi = {
  // Get all clients
  getClients: async (params?: { search?: string; page?: number; per_page?: number }) => {
    const response = await api.get<ApiResponse<Client[]>>('/clients', { params });
    return response.data;
  },

  // Get client by ID
  getClient: async (id: string) => {
    const response = await api.get<ApiResponse<Client>>(`/clients/${id}`);
    return response.data;
  },

  // Create new client
  createClient: async (clientData: { name: string; email: string; phone: string }) => {
    const response = await api.post<ApiResponse<Client>>('/clients', { client: clientData });
    return response.data;
  },

  // Update client
  updateClient: async (id: string, clientData: Partial<{ name: string; email: string; phone: string }>) => {
    const response = await api.patch<ApiResponse<Client>>(`/clients/${id}`, { client: clientData });
    return response.data;
  },

  // Delete client
  deleteClient: async (id: string) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },
};

export const appointmentsApi = {
  // Get all appointments
  getAppointments: async (params?: { status?: string; upcoming?: boolean; page?: number; per_page?: number }) => {
    const response = await api.get<ApiResponse<Appointment[]>>('/appointments', { params });
    return response.data;
  },

  // Get appointment by ID
  getAppointment: async (id: string) => {
    const response = await api.get<ApiResponse<Appointment>>(`/appointments/${id}`);
    return response.data;
  },

  // Create new appointment for a client
  createAppointment: async (clientId: string, appointmentData: CreateAppointmentRequest['appointment']) => {
    const response = await api.post<ApiResponse<Appointment>>(
      `/clients/${clientId}/appointments`,
      { appointment: appointmentData }
    );
    return response.data;
  },

  // Update appointment
  updateAppointment: async (id: string, appointmentData: Partial<CreateAppointmentRequest['appointment']>) => {
    const response = await api.patch<ApiResponse<Appointment>>(
      `/appointments/${id}`,
      { appointment: appointmentData }
    );
    return response.data;
  },

  // Cancel appointment
  cancelAppointment: async (id: string) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },
};


export default api;
