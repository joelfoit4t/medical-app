
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AddPatientView } from '../AddPatientView';

describe('AddPatientView', () => {
  const mockOnAdd = vi.fn();
  const mockOnSuccess = vi.fn();

  it('renders registration form', () => {
    render(<AddPatientView onAddPatient={mockOnAdd} onSuccess={mockOnSuccess} />);
    expect(screen.getByText(/Register New Patient/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. Jonathan Doe/i)).toBeInTheDocument();
  });

  it('submits form correctly', () => {
    render(<AddPatientView onAddPatient={mockOnAdd} onSuccess={mockOnSuccess} />);
    
    fireEvent.change(screen.getByPlaceholderText(/e.g. Jonathan Doe/i), { target: { value: 'New Test Patient' } });
    fireEvent.change(screen.getByPlaceholderText(/Describe the medical reason/i), { target: { value: 'Routine Check' } });
    
    const submitBtn = screen.getByText(/Register & Open Record/i);
    fireEvent.click(submitBtn);

    expect(mockOnAdd).toHaveBeenCalled();
    expect(mockOnSuccess).toHaveBeenCalled();
  });
});
