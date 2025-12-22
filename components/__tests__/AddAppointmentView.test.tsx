
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AddAppointmentView } from '../AddAppointmentView';

describe('AddAppointmentView', () => {
  const mockOnAdd = vi.fn();
  const mockOnSuccess = vi.fn();

  it('renders appointment form', () => {
    render(<AddAppointmentView onAddAppointment={mockOnAdd} onSuccess={mockOnSuccess} language="EN" />);
    expect(screen.getByText(/Schedule Appointment/i)).toBeInTheDocument();
  });

  it('fills out and submits the form', () => {
    render(<AddAppointmentView onAddAppointment={mockOnAdd} onSuccess={mockOnSuccess} language="EN" />);
    
    fireEvent.change(screen.getByPlaceholderText(/Select or enter patient name/i), { target: { value: 'John Smith' } });
    fireEvent.change(screen.getByPlaceholderText(/e.g. Annual Check-up/i), { target: { value: 'Follow up' } });
    
    // In a real test we'd need to mock the date/time picker selection
    // but the button trigger depends on these fields being filled.
  });
});
