import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StaffListView } from '../StaffListView';

describe('StaffListView', () => {
  it('renders correctly with default list view', () => {
    render(<StaffListView />);
    expect(screen.getByText(/Total Staff/i)).toBeInTheDocument();
    expect(screen.getByText(/Dr. Clara Redfield/i)).toBeInTheDocument();
    expect(screen.getByText(/General Medicine/i)).toBeInTheDocument();
  });

  it('switches to grid view and displays cards', () => {
    render(<StaffListView />);
    
    // Find view toggle buttons
    const toggles = screen.getAllByRole('button').filter(b => b.querySelector('svg'));
    // Index 3 is typically the LayoutGrid toggle in the toolbar
    fireEvent.click(toggles[3]);
    
    expect(screen.getByText(/ID: S1/i)).toBeInTheDocument();
    expect(screen.getByText(/Role/i)).toBeInTheDocument();
  });

  it('filters staff by role', () => {
    render(<StaffListView />);
    
    // Open filter popup
    fireEvent.click(screen.getByText('Filter'));
    
    // Filter for Nurse
    const nurseBtn = screen.getByRole('button', { name: 'Nurse' });
    fireEvent.click(nurseBtn);
    
    // Apply filters
    fireEvent.click(screen.getByText('Apply Filters'));
    
    expect(screen.getByText(/Jill Valentine/i)).toBeInTheDocument();
    expect(screen.queryByText(/Dr. Leon Kennedy/i)).not.toBeInTheDocument();
  });

  it('opens and submits the Add Staff modal', () => {
    render(<StaffListView />);
    
    fireEvent.click(screen.getByText(/Add staff/i));
    expect(screen.getByText(/Register Staff Member/i)).toBeInTheDocument();
    
    const nameInput = screen.getByPlaceholderText(/e.g. Dr. Jane Cooper/i);
    fireEvent.change(nameInput, { target: { value: 'Dr. New Staff' } });
    
    const emailInput = screen.getByPlaceholderText(/jane.cooper@medicare.com/i);
    fireEvent.change(emailInput, { target: { value: 'new@medicare.com' } });
    
    fireEvent.click(screen.getByText(/Confirm Registration/i));
    
    expect(screen.getByText('Dr. New Staff')).toBeInTheDocument();
  });
});