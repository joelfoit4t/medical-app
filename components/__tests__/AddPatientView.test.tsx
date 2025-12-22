
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AddPatientView } from '../AddPatientView';

describe('AddPatientView', () => {
  const mockOnAdd = vi.fn();
  const mockOnClose = vi.fn();

  it('renders registration form', () => {
    // Corrected props: removed onSuccess, added language and onClose
    render(<AddPatientView onAddPatient={mockOnAdd} onClose={mockOnClose} language="EN" />);
    expect(screen.getByText(/Register New Patient/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. Jonathan Doe/i)).toBeInTheDocument();
  });

  it('submits form correctly', () => {
    // Corrected props: removed onSuccess, added language and onClose
    render(<AddPatientView onAddPatient={mockOnAdd} onClose={mockOnClose} language="EN" />);
    
    fireEvent.change(screen.getByPlaceholderText(/e.g. Jonathan Doe/i), { target: { value: 'New Test Patient' } });
    // Fix placeholder to match the actual component: "Briefly describe the reason for visit..."
    fireEvent.change(screen.getByPlaceholderText(/Briefly describe the reason/i), { target: { value: 'Routine Check' } });
    
    const submitBtn = screen.getByText(/Register & Open Record/i);
    fireEvent.click(submitBtn);

    expect(mockOnAdd).toHaveBeenCalled();
  });
});
