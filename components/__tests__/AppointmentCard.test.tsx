
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppointmentCard } from '../AppointmentCard';
import { AppointmentStatus } from '../../types';

describe('AppointmentCard', () => {
  const mockApt = {
    id: '1',
    patientName: 'John Doe',
    reason: 'Fever',
    startTime: '10:00',
    endTime: '11:00',
    date: '2025-05-12',
    status: AppointmentStatus.Scheduled,
    dayIndex: 0
  };

  it('renders appointment details', () => {
    render(<AppointmentCard appointment={mockApt} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Fever')).toBeInTheDocument();
    expect(screen.getByText('10:00 - 11:00')).toBeInTheDocument();
    expect(screen.getByText(/Scheduled/i)).toBeInTheDocument();
  });

  it('shows correct status badge for Completed', () => {
    render(<AppointmentCard appointment={{ ...mockApt, status: AppointmentStatus.Completed }} />);
    expect(screen.getByText(/Completed/i)).toBeInTheDocument();
  });

  it('shows correct status badge for Waiting', () => {
    render(<AppointmentCard appointment={{ ...mockApt, status: AppointmentStatus.Waiting }} />);
    expect(screen.getByText(/Patient is waiting/i)).toBeInTheDocument();
  });
});
