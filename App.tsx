import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CalendarView } from './components/CalendarView';
import { PatientListView } from './components/PatientListView';
import { PatientProfileView } from './components/PatientProfileView';
import { AddPatientView } from './components/AddPatientView';
import { AddAppointmentView } from './components/AddAppointmentView';
import { StaffListView } from './components/StaffListView';
import { NavItem, Patient, Appointment } from './types';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS } from './constants';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<NavItem>('Appointment List');
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const handleAddPatient = (newPatient: Patient) => {
    setPatients(prev => [newPatient, ...prev]);
  };

  const handleAddAppointment = (newAppointment: Appointment) => {
    setAppointments(prev => [...prev, newAppointment]);
  };

  const handleUpdateAppointment = (updatedApt: Appointment) => {
    setAppointments(prev => prev.map(apt => apt.id === updatedApt.id ? updatedApt : apt));
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  const handleNavigateToProfile = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveNav('Patient Profile');
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'Appointment':
      case 'Appointment List':
        return (
          <CalendarView 
            appointments={appointments} 
            onUpdateAppointment={handleUpdateAppointment}
            onDeleteAppointment={handleDeleteAppointment}
          />
        );
      case 'Add Appointment':
        return (
          <AddAppointmentView 
            onAddAppointment={handleAddAppointment}
            onSuccess={() => setActiveNav('Appointment List')}
          />
        );
      case 'Patient':
      case 'Patient List':
        return (
          <PatientListView 
            patients={patients} 
            setPatients={setPatients} 
            onViewProfile={handleNavigateToProfile}
          />
        );
      case 'Patient Profile':
        return <PatientProfileView patients={patients} selectedId={selectedPatientId} onBack={() => setActiveNav('Patient List')} />;
      case 'Add Patient':
        return (
          <AddPatientView 
            onAddPatient={handleAddPatient} 
            onSuccess={() => setActiveNav('Patient List')} 
          />
        );
      case 'Staff':
        return <StaffListView />;
      case 'Dashboard':
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 h-[calc(100vh-64px)]">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
                  <span className="text-3xl">📊</span>
                </div>
                <h2 className="text-lg font-bold text-slate-800 mb-1">Dashboard</h2>
                <p className="text-sm">Advanced analytics coming soon...</p>
            </div>
        );
      default:
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 capitalize h-[calc(100vh-64px)]">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-300 text-3xl">
                  {activeNav === 'Report' ? '📝' : activeNav === 'Clinic' ? '🏥' : '💬'}
                </div>
                <h2 className="text-lg font-bold text-slate-800 mb-1">{activeNav}</h2>
                <p className="text-sm">This module is currently being developed.</p>
            </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        isOpen={isSidebarOpen} 
        activeItem={activeNav}
        onNavigate={(item) => {
            setActiveNav(item);
            setIsSidebarOpen(false);
        }}
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header activeNav={activeNav} onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="lg:pl-64 pt-16 flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default App;