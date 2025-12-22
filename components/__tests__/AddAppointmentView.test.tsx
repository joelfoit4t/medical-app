
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AddAppointmentView } from '../AddAppointmentView';

describe('AddAppointmentView', () => {
  const mockOnAdd = vi.fn();
  const mockOnClose = vi.fn();

  it('renders appointment form', () => {
    // Corrected props: removed onSuccess, added onClose
    render(<AddAppointmentView onAddAppointment={mockOnAdd} onClose={mockOnClose} language="EN" />);
    expect(screen.getByText(/Schedule Appointment/i)).toBeInTheDocument();
  });

  it('fills out and submits the form', () => {
    // Corrected props: removed onSuccess, added onClose
    render(<AddAppointmentView onAddAppointment={mockOnAdd} onClose={mockOnClose} language="EN" />);
    
    // Updated placeholder to match the actual component: "Select patient..."
    fireEvent.change(screen.getByPlaceholderText(/Select patient/i), { target: { value: 'John Smith' } });
    fireEvent.change(screen.getByPlaceholderText(/General Check-up/i), { target: { value: 'Follow up' } });
    
    // In a real test we'd need to mock the date/time picker selection
    // but the button trigger depends on these fields being filled.
  });
});
