import React, { useState, useEffect } from 'react';
import { Client } from '../types';
import { clientsApi } from '../services/api';
import './ClientList.css';

interface ClientListProps {
  onClientSelect: (client: Client) => void;
  selectedClient?: Client | null;
}

const ClientList: React.FC<ClientListProps> = ({ onClientSelect, selectedClient }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchClients();
  }, [search]); // fetchClients is stable since it's defined inline

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientsApi.getClients(search ? { search } : undefined);
      setClients(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to fetch clients');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleClientClick = (client: Client) => {
    onClientSelect(client);
  };

  if (loading && clients.length === 0) {
    return <div className="client-list-loading">Loading clients...</div>;
  }

  return (
    <div className="client-list">
      <div className="client-list-header">
        <h2>Clients</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search clients by name, email, or phone..."
            value={search}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchClients} className="retry-button">
            Retry
          </button>
        </div>
      )}

      <div className="clients-container">
        {loading && <div className="loading-overlay">Searching...</div>}
        
        {clients.length === 0 && !loading && (
          <div className="no-clients">
            {search ? 'No clients found matching your search.' : 'No clients found.'}
          </div>
        )}

        {clients.map((client) => (
          <div
            key={client.id}
            className={`client-card ${selectedClient?.id === client.id ? 'selected' : ''}`}
            onClick={() => handleClientClick(client)}
          >
            <div className="client-info">
              <h3 className="client-name">{client.attributes.name}</h3>
              <p className="client-email">{client.attributes.email}</p>
              <p className="client-phone">{client.attributes.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientList;
