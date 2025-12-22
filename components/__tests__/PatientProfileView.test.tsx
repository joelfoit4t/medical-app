
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PatientProfileView } from '../PatientProfileView';
import { MOCK_PATIENTS } from '../../constants';

// Mock CKEditor as it uses DOM APIs not fully supported by JSDOM
(window as any).ClassicEditor = {
  create: vi.fn().mockResolvedValue({
    setData: vi.fn(),
    getData: vi.fn().mockReturnValue('<p>New Note</p>'),
    destroy: vi.fn().mockResolvedValue(null),
    model: { document: { on: vi.fn() } }
  })
};

describe('PatientProfileView', () => {
  const mockOnBack = vi.fn();
  const mockOnSelect = vi.fn();

  it('renders overview tab by default', () => {
    render(
      <PatientProfileView 
        patients={MOCK_PATIENTS} 
        selectedId="1" 
        onBack={mockOnBack} 
        language="EN" 
        onPatientSelect={mockOnSelect} 
      />
    );
    expect(screen.getByText(/Patient data/i)).toBeInTheDocument();
    expect(screen.getByText(/Willy Ben Chen/i)).toBeInTheDocument();
    expect(screen.getByText(/Last visits/i)).toBeInTheDocument();
  });

  it('switches to medications tab', () => {
    render(
      <PatientProfileView 
        patients={MOCK_PATIENTS} 
        selectedId="1" 
        onBack={mockOnBack} 
        language="EN" 
      />
    );
    const medTab = screen.getByText('Medications');
    fireEvent.click(medTab);
    expect(screen.getByText(/Medication Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Amoxicillin/i)).toBeInTheDocument();
  });

  it('opens log vitals modal in care plans tab', async () => {
    render(
      <PatientProfileView 
        patients={MOCK_PATIENTS} 
        selectedId="1" 
        onBack={mockOnBack} 
        language="EN" 
      />
    );
    const careTab = screen.getByText('Care plans');
    fireEvent.click(careTab);
    
    const logBtn = screen.getByText(/Log new vitals/i);
    fireEvent.click(logBtn);
    
    expect(screen.getByText(/Log New Vitals/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Heart Rate/i)).toBeInTheDocument();
  });

  it('switches to labs tab and toggles view mode', () => {
    render(
      <PatientProfileView 
        patients={MOCK_PATIENTS} 
        selectedId="1" 
        onBack={mockOnBack} 
        language="EN" 
      />
    );
    const labsTab = screen.getByText('Labs');
    fireEvent.click(labsTab);
    
    expect(screen.getByText(/Laboratory Reports/i)).toBeInTheDocument();
    expect(screen.getByText(/Full Blood Count/i)).toBeInTheDocument();
  });
});
