import { useState, useEffect, useCallback } from 'react';
import { Client } from '../types';
import { clientsApi } from '../services/api';

export const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeAsync = async <T>(
    operation: () => Promise<T>,
    errorMessage = 'An error occurred'
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await operation();
      return result;
    } catch (err: any) {
      const message = err.response?.data?.error?.message || errorMessage;
      setError(message);
      console.error('Async operation error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { loading, error, executeAsync, clearError };
};


export const useClients = (selectedClient?: Client | null) => {
  const [clients, setClients] = useState<Client[]>([]);
  const { loading, error, executeAsync } = useAsyncOperation();

  const fetchClients = useCallback(async () => {
    const result = await executeAsync(
      () => clientsApi.getClients(),
      'Failed to fetch clients'
    );
    
    if (result) {
      setClients(result.data);
    }
  }, [executeAsync]);

  useEffect(() => {
    if (!selectedClient) {
      fetchClients();
    }
  }, [selectedClient, fetchClients]);

  return {
    clients,
    loading,
    error,
    refetch: fetchClients
  };
};

