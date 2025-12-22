import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AddPatientView } from '../AddPatientView';

describe('AddPatientView', () => {
  const mockOnAdd = vi.fn();
  const mockOnClose = vi.fn();

  it('renders registration form correctly', () => {
    render(<AddPatientView onAddPatient={mockOnAdd} onClose={mockOnClose} language="EN" />);
    expect(screen.getByText(/Register New Patient/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Legal Name/i)).toBeInTheDocument();
  });

  it('handles gender selection and form submission', () => {
    render(<AddPatientView onAddPatient={mockOnAdd} onClose={mockOnClose} language="EN" />);
    
    // Fill Name
    fireEvent.change(screen.getByPlaceholderText(/e.g. Jonathan Doe/i), { target: { value: 'Alice Wonderland' } });
    
    // Change Gender
    const femaleBtn = screen.getByRole('button', { name: 'Female' });
    fireEvent.click(femaleBtn);
    expect(femaleBtn).toHaveClass('text-emerald-600'); // Check active style

    // Fill Age
    fireEvent.change(screen.getByPlaceholderText(/Years/i), { target: { value: '30' } });

    // Fill Diagnosis
    fireEvent.change(screen.getByPlaceholderText(/Briefly describe the reason/i), { target: { value: 'Hyperthyroidism' } });

    // Submit
    const submitBtn = screen.getByRole('button', { name: /Register & Open Record/i });
    fireEvent.click(submitBtn);

    expect(mockOnAdd).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Alice Wonderland',
      gender: 'Female',
      age: 30,
      diagnosis: 'Hyperthyroidism'
    }));
  });

  it('clears form when Reset Form is clicked', () => {
    render(<AddPatientView onAddPatient={mockOnAdd} onClose={mockOnClose} language="EN" />);
    const nameInput = screen.getByPlaceholderText(/e.g. Jonathan Doe/i);
    fireEvent.change(nameInput, { target: { value: 'Dirty Data' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Reset Form/i }));
    expect(nameInput).toHaveValue('');
  });
});