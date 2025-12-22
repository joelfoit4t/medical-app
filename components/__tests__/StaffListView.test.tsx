
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StaffListView } from '../StaffListView';

describe('StaffListView', () => {
  it('renders staff list by default', () => {
    render(<StaffListView />);
    expect(screen.getByText(/Total Staff/i)).toBeInTheDocument();
    expect(screen.getByText(/Dr. Clara Redfield/i)).toBeInTheDocument();
  });

  it('switches to grid view', () => {
    render(<StaffListView />);
    const gridToggle = screen.getAllByRole('button').find(b => b.innerHTML.includes('svg')); 
    // View toggles are the first few buttons
    const toggles = screen.queryAllByRole('button');
    // Find the button with LayoutGrid icon - simplified by finding the one after search
    fireEvent.click(toggles[3]); // Index based on implementation
    
    // Check if grid specific ID label appears
    expect(screen.getAllByText(/ID: S1/i).length).toBeGreaterThan(0);
  });

  it('opens advanced filters popup', () => {
    render(<StaffListView />);
    const filterBtn = screen.getByText(/Filter/i);
    fireEvent.click(filterBtn);
    expect(screen.getByText(/Advanced Filters/i)).toBeInTheDocument();
    expect(screen.getByText(/Professional Role/i)).toBeInTheDocument();
  });
});
