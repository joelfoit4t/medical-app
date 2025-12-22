
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Sidebar } from '../Sidebar';

describe('Sidebar', () => {
  const mockOnNavigate = vi.fn();
  const mockOnClose = vi.fn();

  it('renders all main navigation items', () => {
    render(
      <Sidebar 
        isOpen={true} 
        activeItem="Dashboard" 
        onNavigate={mockOnNavigate} 
        onClose={mockOnClose} 
        language="EN" 
      />
    );
    expect(screen.getByText(/Siloe Med/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Appointment/i)).toBeInTheDocument();
    expect(screen.getByText(/Patient/i)).toBeInTheDocument();
  });

  it('expands patient sub-menu when Patient is clicked', () => {
    render(
      <Sidebar 
        isOpen={true} 
        activeItem="Dashboard" 
        onNavigate={mockOnNavigate} 
        onClose={mockOnClose} 
        language="EN" 
      />
    );
    const patientBtn = screen.getByText(/Patient/i);
    fireEvent.click(patientBtn);
    expect(screen.getByText(/Patient List/i)).toBeInTheDocument();
    expect(screen.getByText(/Patient Profile/i)).toBeInTheDocument();
  });

  it('calls onNavigate when a sub-item is clicked', () => {
    render(
      <Sidebar 
        isOpen={true} 
        activeItem="Patient List" 
        onNavigate={mockOnNavigate} 
        onClose={mockOnClose} 
        language="EN" 
      />
    );
    const addPatientBtn = screen.getByText(/Add Patient/i);
    fireEvent.click(addPatientBtn);
    expect(mockOnNavigate).toHaveBeenCalledWith('Add Patient');
  });
});
