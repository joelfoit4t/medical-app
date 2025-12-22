import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PatientListView } from '../PatientListView';
import { MOCK_PATIENTS } from '../../constants';

describe('PatientListView', () => {
  const mockSetPatients = vi.fn();
  const mockOnViewProfile = vi.fn();
  const mockOnAddPatient = vi.fn();

  it('renders patient table and summary stats', () => {
    render(<PatientListView patients={MOCK_PATIENTS} setPatients={mockSetPatients} onViewProfile={mockOnViewProfile} onAddPatient={mockOnAddPatient} language="EN" />);
    
    expect(screen.getByText(/Total patients/i)).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument(); // Count from mock
    expect(screen.getByText(/Willy Ben Chen/i)).toBeInTheDocument();
  });

  it('searches for a patient', () => {
    render(<PatientListView patients={MOCK_PATIENTS} setPatients={mockSetPatients} onViewProfile={mockOnViewProfile} onAddPatient={mockOnAddPatient} language="EN" />);
    
    const searchInput = screen.getByPlaceholderText(/Search../i);
    fireEvent.change(searchInput, { target: { value: 'Emily' } });
    
    expect(screen.getByText(/Emily Watford/i)).toBeInTheDocument();
    expect(screen.queryByText(/Willy Ben Chen/i)).not.toBeInTheDocument();
  });

  it('filters patients by status', () => {
    render(<PatientListView patients={MOCK_PATIENTS} setPatients={mockSetPatients} onViewProfile={mockOnViewProfile} onAddPatient={mockOnAddPatient} language="EN" />);
    
    // Click "Mild patients" stat card to filter
    fireEvent.click(screen.getByText(/Mild patients/i));
    
    // Check if only mild patients remain (e.g. Sarah Mitchell)
    expect(screen.getByText(/Sarah Mitchell/i)).toBeInTheDocument();
    expect(screen.queryByText(/Emily Watford/i)).not.toBeInTheDocument(); // Emily is critical
  });

  it('handles row selection', () => {
    render(<PatientListView patients={MOCK_PATIENTS} setPatients={mockSetPatients} onViewProfile={mockOnViewProfile} onAddPatient={mockOnAddPatient} language="EN" />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // Select first patient
    
    expect(checkboxes[1]).toBeChecked();
  });

  it('opens edit modal and updates patient data', () => {
    render(<PatientListView patients={MOCK_PATIENTS} setPatients={mockSetPatients} onViewProfile={mockOnViewProfile} onAddPatient={mockOnAddPatient} language="EN" />);
    
    // Open action menu
    const moreBtns = screen.getAllByRole('button').filter(b => b.querySelector('.lucide-more-horizontal'));
    fireEvent.click(moreBtns[0]);
    
    const editBtn = screen.getByText(/Edit Record/i);
    fireEvent.click(editBtn);
    
    expect(screen.getByText(/Edit Patient Record/i)).toBeInTheDocument();
    
    const nameInput = screen.getByDisplayValue(/Willy Ben Chen/i);
    fireEvent.change(nameInput, { target: { value: 'Willy Updated' } });
    
    fireEvent.click(screen.getByText(/Update Record/i));
    
    expect(mockSetPatients).toHaveBeenCalled();
  });
});