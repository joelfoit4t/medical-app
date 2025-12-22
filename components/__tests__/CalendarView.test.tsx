
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CalendarView } from '../CalendarView';
import { MOCK_APPOINTMENTS } from '../../constants';

describe('CalendarView (Appointment List)', () => {
  const mockOnUpdate = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnAdd = vi.fn();

  it('renders the list of appointments correctly', () => {
    render(
      <CalendarView 
        appointments={MOCK_APPOINTMENTS}
        onUpdateAppointment={mockOnUpdate}
        onDeleteAppointment={mockOnDelete}
        onAddAppointment={mockOnAdd}
        language="EN"
      />
    );

    // Should render the table headers in list view (default)
    expect(screen.getByText(/Patient Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Reason for visit/i)).toBeInTheDocument();
    
    // Check for some mock data
    // We expect "Tony Hack" or "Emily Watford" based on MOCK_APPOINTMENTS
    expect(screen.getAllByText(/Tony Hack/i).length).toBeGreaterThan(0);
  });

  it('switches between List and Calendar views', () => {
    render(
      <CalendarView 
        appointments={MOCK_APPOINTMENTS}
        onUpdateAppointment={mockOnUpdate}
        onDeleteAppointment={mockOnDelete}
        onAddAppointment={mockOnAdd}
        language="EN"
      />
    );

    const calendarBtn = screen.getByRole('button', { name: /Calendar/i });
    fireEvent.click(calendarBtn);
    
    // GMT +7 is only visible in calendar view grid
    expect(screen.getByText(/GMT \+7/i)).toBeInTheDocument();

    const listBtn = screen.getByRole('button', { name: /List/i });
    fireEvent.click(listBtn);
    expect(screen.queryByText(/GMT \+7/i)).not.toBeInTheDocument();
  });

  it('triggers the Add Appointment navigation', () => {
    render(
      <CalendarView 
        appointments={MOCK_APPOINTMENTS}
        onUpdateAppointment={mockOnUpdate}
        onDeleteAppointment={mockOnDelete}
        onAddAppointment={mockOnAdd}
        language="EN"
      />
    );

    const addBtn = screen.getByRole('button', { name: /Add Appointment/i });
    fireEvent.click(addBtn);
    expect(mockOnAdd).toHaveBeenCalled();
  });
});
