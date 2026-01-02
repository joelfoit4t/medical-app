import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CalendarView } from '../CalendarView';
import { MOCK_APPOINTMENTS } from '../../constants';
import { AppointmentStatus } from '../../types';

describe('CalendarView', () => {
  const mockUpdate = vi.fn();
  const mockDelete = vi.fn();
  const mockAdd = vi.fn();

  it('updates an appointment status through the edit modal', () => {
    render(
      <CalendarView 
        appointments={MOCK_APPOINTMENTS}
        onUpdateAppointment={mockUpdate}
        onDeleteAppointment={mockDelete}
        onAddAppointment={mockAdd}
        language="EN"
      />
    );

    // Switch to List view first as Calendar is now default
    const listToggle = screen.getByRole('button', { name: /List/i });
    fireEvent.click(listToggle);
    
    // Find Tony Hack and open edit
    const moreBtn = screen.getAllByRole('button').find(b => b.querySelector('.lucide-more-horizontal'));
    if (moreBtn) fireEvent.click(moreBtn);
    
    fireEvent.click(screen.getByText(/Edit/i));
    
    // Change status
    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: AppointmentStatus.Waiting } });
    
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));
    
    expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
      status: AppointmentStatus.Waiting
    }));
  });

  it('switches between List and Calendar views', () => {
    render(<CalendarView appointments={MOCK_APPOINTMENTS} onUpdateAppointment={mockUpdate} onDeleteAppointment={mockDelete} onAddAppointment={mockAdd} language="EN" />);
    
    // Test switch to List (Calendar is already default)
    const listToggle = screen.getByRole('button', { name: /List/i });
    fireEvent.click(listToggle);
    expect(screen.getByText(/Patient Name/i)).toBeInTheDocument();

    // Switch back to Calendar
    const calendarToggle = screen.getByRole('button', { name: /Calendar/i });
    fireEvent.click(calendarToggle);
    expect(screen.getByText(/GMT \+7/i)).toBeInTheDocument();
  });

  it('filters appointments by status', () => {
    render(<CalendarView appointments={MOCK_APPOINTMENTS} onUpdateAppointment={mockUpdate} onDeleteAppointment={mockDelete} onAddAppointment={mockAdd} language="EN" />);
    
    // Switch to List view to easily verify filtering in table
    const listToggle = screen.getByRole('button', { name: /List/i });
    fireEvent.click(listToggle);

    // Open filter
    fireEvent.click(screen.getAllByRole('button')[2]); // SlidersHorizontal icon
    
    // Select "Canceled"
    fireEvent.click(screen.getByText('Canceled'));
    
    // Check if only canceled appointments are shown
    expect(screen.getAllByText(/Canceled/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Scheduled/i)).not.toBeInTheDocument();
  });
});