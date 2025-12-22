
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CalendarView } from './components/CalendarView';
import { PatientListView } from './components/PatientListView';
import { PatientProfileView } from './components/PatientProfileView';
import { AddPatientView } from './components/AddPatientView';
import { AddAppointmentView } from './components/AddAppointmentView';
import { StaffListView } from './components/StaffListView';
import { SignInView } from './components/SignInView';
import { SignUpView } from './components/SignUpView';
import { ForgotPasswordView } from './components/ForgotPasswordView';
import { NavItem, Patient, Appointment, Language } from './types';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS } from './constants';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot-password'>('signin');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<NavItem>('Appointment List');
  const [language, setLanguage] = useState<Language>('EN');
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Modal states
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] = useState(false);

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

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthMode('signin');
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setActiveNav('Appointment List');
  };

  const handleNavigation = (item: NavItem) => {
    if (item === 'Add Patient') {
      setIsAddPatientModalOpen(true);
    } else if (item === 'Add Appointment') {
      setIsAddAppointmentModalOpen(true);
    } else {
      setActiveNav(item);
    }
    setIsSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'Appointment':
      case 'Appointment List':
        return (
          <CalendarView 
            language={language}
            appointments={appointments} 
            onUpdateAppointment={handleUpdateAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            onAddAppointment={() => setIsAddAppointmentModalOpen(true)}
          />
        );
      case 'Patient':
      case 'Patient List':
        return (
          <PatientListView 
            language={language}
            patients={patients} 
            setPatients={setPatients} 
            onViewProfile={handleNavigateToProfile}
            onAddPatient={() => setIsAddPatientModalOpen(true)}
          />
        );
      case 'Patient Profile':
        return (
          <PatientProfileView 
            language={language} 
            patients={patients} 
            selectedId={selectedPatientId} 
            onBack={() => setActiveNav('Patient List')}
            onPatientSelect={handleNavigateToProfile}
          />
        );
      case 'Staff':
        return <StaffListView />;
      case 'Dashboard':
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 h-[calc(100vh-64px)]">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 text-emerald-500 shadow-sm border border-emerald-100">
                  <span className="text-3xl">📊</span>
                </div>
                <h2 className="text-lg font-bold text-slate-800 mb-1">Dashboard</h2>
                <p className="text-sm">Advanced analytics coming soon...</p>
            </div>
        );
      default:
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 capitalize h-[calc(100vh-64px)]">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 text-emerald-500 shadow-sm border border-emerald-100 text-3xl">
                  {activeNav === 'Report' ? '📝' : activeNav === 'Clinic' ? '🏥' : '💬'}
                </div>
                <h2 className="text-lg font-bold text-slate-800 mb-1">{activeNav}</h2>
                <p className="text-sm">This module is currently being developed.</p>
            </div>
        );
    }
  };

  if (!isAuthenticated) {
    if (authMode === 'signup') {
      return (
        <SignUpView 
          onSignUp={handleLogin} 
          onSignInClick={() => setAuthMode('signin')} 
        />
      );
    }
    if (authMode === 'forgot-password') {
      return (
        <ForgotPasswordView 
          onBackClick={() => setAuthMode('signin')} 
        />
      );
    }
    return (
      <SignInView 
        onSignIn={handleLogin} 
        onSignUpClick={() => setAuthMode('signup')}
        onForgotPasswordClick={() => setAuthMode('forgot-password')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        isOpen={isSidebarOpen} 
        activeItem={activeNav}
        onNavigate={handleNavigation}
        onClose={() => setIsSidebarOpen(false)} 
        language={language}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          activeNav={activeNav} 
          onMenuClick={() => setIsSidebarOpen(true)} 
          language={language}
          onLanguageChange={setLanguage}
          onLogout={handleLogout}
        />
        
        <main className="lg:pl-64 pt-16 flex-1 overflow-y-auto bg-[#fcfcfc]">
          {renderContent()}
        </main>
      </div>

      {/* Overlay Modals */}
      {isAddPatientModalOpen && (
        <AddPatientView 
          language={language}
          onAddPatient={(p) => {
            handleAddPatient(p);
            setIsAddPatientModalOpen(false);
          }}
          onClose={() => setIsAddPatientModalOpen(false)}
        />
      )}

      {isAddAppointmentModalOpen && (
        <AddAppointmentView 
          language={language}
          onAddAppointment={(a) => {
            handleAddAppointment(a);
            setIsAddAppointmentModalOpen(false);
          }}
          onClose={() => setIsAddAppointmentModalOpen(false)}
        />
      )}
      
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
