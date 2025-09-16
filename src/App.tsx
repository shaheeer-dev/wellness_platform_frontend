import  { useState } from 'react';
import { Client } from './types';
import ClientList from './components/ClientList';
import AppointmentsList from './components/AppointmentsList';
import AppointmentForm from './components/AppointmentForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleAppointmentCreated = () => {
    setRefreshKey(prev => prev + 1);
    setShowAppointmentForm(false);
    toast.success('Appointment scheduled successfully!');
  };


  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🏥 Wellness Platform</h1>
          <div className="header-actions">
            <button 
              onClick={() => setShowAppointmentForm(true)} 
              className="primary-button"
            >
              + Schedule Appointment
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {showAppointmentForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <AppointmentForm
                selectedClient={selectedClient}
                onAppointmentCreated={handleAppointmentCreated}
                onClose={() => setShowAppointmentForm(false)}
              />
            </div>
          </div>
        )}

        <div className="main-content">
          <div className="sidebar">
            <ClientList
              onClientSelect={handleClientSelect}
              selectedClient={selectedClient}
            />
          </div>

          <div className="content">
            <AppointmentsList
              key={`appointments-${refreshKey}`}
              selectedClient={selectedClient}
              onAppointmentUpdate={handleRefresh}
            />
          </div>
        </div>
      </main>
      
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
