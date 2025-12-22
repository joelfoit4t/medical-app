import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AddAppointmentView } from '../AddAppointmentView';

describe('AddAppointmentView', () => {
  const mockOnAdd = vi.fn();
  const mockOnClose = vi.fn();

  it('renders appointment form with all required fields', () => {
    render(<AddAppointmentView onAddAppointment={mockOnAdd} onClose={mockOnClose} language="EN" />);
    expect(screen.getByText(/Schedule Appointment/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Select patient/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Reason/i)).toBeInTheDocument();
  });

  it('validates required fields and submits the form successfully', async () => {
    render(<AddAppointmentView onAddAppointment={mockOnAdd} onClose={mockOnClose} language="EN" />);
    
    // Fill patient name
    fireEvent.change(screen.getByPlaceholderText(/Select patient/i), { target: { value: 'John Smith' } });
    
    // Fill reason
    fireEvent.change(screen.getByPlaceholderText(/General Check-up/i), { target: { value: 'Annual Physical' } });
    
    // Select Date (triggers internal state via MaterialDatePicker)
    const dateTrigger = screen.getByText(/Select date/i);
    fireEvent.click(dateTrigger);
    const dayButton = screen.getByText('15'); // Pick any day from the mock picker
    fireEvent.click(dayButton);

    // Select Start Time
    const startTimeTriggers = screen.getAllByText('--:-- --');
    fireEvent.click(startTimeTriggers[0]);
    fireEvent.click(screen.getByText('09'));
    fireEvent.click(screen.getByText('30'));
    fireEvent.click(screen.getByText('Done'));

    // Select End Time
    fireEvent.click(screen.getAllByText('--:-- --')[0]); // The second one now that first is filled
    fireEvent.click(screen.getByText('10'));
    fireEvent.click(screen.getByText('30'));
    fireEvent.click(screen.getByText('Done'));
    
    // Submit
    const submitBtn = screen.getByRole('button', { name: /Confirm Appointment/i });
    fireEvent.click(submitBtn);

    expect(mockOnAdd).toHaveBeenCalled();
    const callArgs = mockOnAdd.mock.calls[0][0];
    expect(callArgs.patientName).toBe('John Smith');
    expect(callArgs.reason).toBe('Annual Physical');
  });

  it('calls onClose when discard button is clicked', () => {
    render(<AddAppointmentView onAddAppointment={mockOnAdd} onClose={mockOnClose} language="EN" />);
    fireEvent.click(screen.getByRole('button', { name: /Discard/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });
});