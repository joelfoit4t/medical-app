import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CalendarView } from '../CalendarView';
import { MOCK_APPOINTMENTS } from '../../constants';

describe('CalendarView', () => {
  const mockUpdate = vi.fn();
  const mockDelete = vi.fn();
  const mockAdd = vi.fn();

  it('renders list view by default and filters appointments', () => {
    render(
      <CalendarView 
        appointments={MOCK_APPOINTMENTS}
        onUpdateAppointment={mockUpdate}
        onDeleteAppointment={mockDelete}
        onAddAppointment={mockAdd}
        language="EN"
      />
    );

    expect(screen.getByText(/Patient Name/i)).toBeInTheDocument();
    // Check for some mock data
    expect(screen.getAllByText(/Tony Hack/i).length).toBeGreaterThan(0);
  });

  it('switches to calendar view and shows week days', () => {
    render(<CalendarView appointments={MOCK_APPOINTMENTS} onUpdateAppointment={mockUpdate} onDeleteAppointment={mockDelete} onAddAppointment={mockAdd} language="EN" />);
    
    fireEvent.click(screen.getByText('Calendar'));
    
    expect(screen.getByText(/GMT \+7/i)).toBeInTheDocument();
    expect(screen.getByText(/MON/i)).toBeInTheDocument();
    expect(screen.getByText(/FRI/i)).toBeInTheDocument();
  });

  it('navigates between weeks in calendar view', () => {
    render(<CalendarView appointments={MOCK_APPOINTMENTS} onUpdateAppointment={mockUpdate} onDeleteAppointment={mockDelete} onAddAppointment={mockAdd} language="EN" />);
    
    fireEvent.click(screen.getByText('Calendar'));
    
    const initialDate = screen.getByText(/April 22, 2025/i);
    expect(initialDate).toBeInTheDocument();
    
    // Click next week
    const nextBtn = screen.getAllByRole('button').find(b => b.querySelector('svg')?.classList.contains('lucide-chevron-right'));
    if (nextBtn) fireEvent.click(nextBtn);
    
    expect(screen.getByText(/April 29, 2025/i)).toBeInTheDocument();
  });

  it('opens edit modal when clicking an appointment card', () => {
    render(<CalendarView appointments={MOCK_APPOINTMENTS} onUpdateAppointment={mockUpdate} onDeleteAppointment={mockDelete} onAddAppointment={mockAdd} language="EN" />);
    
    fireEvent.click(screen.getByText('Calendar'));
    
    // Find an appointment card (e.g. Tony Hack)
    const card = screen.getByText('Tony Hack');
    fireEvent.click(card);
    
    expect(screen.getByText(/Edit Appointment/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Tony Hack')).toBeInTheDocument();
  });

  it('handles appointment deletion from list view', () => {
    render(<CalendarView appointments={MOCK_APPOINTMENTS} onUpdateAppointment={mockUpdate} onDeleteAppointment={mockDelete} onAddAppointment={mockAdd} language="EN" />);
    
    // Open action menu for first row
    const moreBtn = screen.getAllByRole('button').find(b => b.querySelector('.lucide-more-horizontal'));
    if (moreBtn) {
      fireEvent.click(moreBtn);
      const deleteBtn = screen.getByText(/Delete/i);
      fireEvent.click(deleteBtn);
      expect(mockDelete).toHaveBeenCalled();
    }
  });
});