import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StaffListView } from '../StaffListView';
import { StaffRole } from '../../types';

describe('StaffListView', () => {
  it('toggles between list and grid view correctly', () => {
    render(<StaffListView />);
    
    // Default is List
    expect(screen.getByText(/Staff Name/i)).toBeInTheDocument();
    
    // Switch to Grid
    const toggles = screen.getAllByRole('button').filter(b => b.querySelector('svg'));
    fireEvent.click(toggles[3]); // LayoutGrid icon
    
    // In grid mode, we see cards with email labels
    expect(screen.getAllByText(/Email/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Email Address/i)).not.toBeInTheDocument(); // Table header should be gone
  });

  it('handles role and status filtering combinations', () => {
    render(<StaffListView />);
    
    // Open filter
    fireEvent.click(screen.getByRole('button', { name: /Filter/i }));
    
    // Select Surgeon role
    fireEvent.click(screen.getByRole('button', { name: 'Surgeon' }));
    fireEvent.click(screen.getByRole('button', { name: /Apply Filters/i }));
    
    expect(screen.getByText(/Dr. Leon Kennedy/i)).toBeInTheDocument();
    expect(screen.queryByText(/Dr. Clara Redfield/i)).not.toBeInTheDocument();
  });

  it('removes a staff member from the list', () => {
    render(<StaffListView />);
    
    const moreBtns = screen.getAllByRole('button').filter(b => b.querySelector('.lucide-more-horizontal'));
    fireEvent.click(moreBtns[0]);
    
    fireEvent.click(screen.getByText(/Remove Staff/i));
    
    expect(screen.queryByText(/Dr. Clara Redfield/i)).not.toBeInTheDocument();
  });
});