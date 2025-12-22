import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PatientProfileView } from '../PatientProfileView';
import { MOCK_PATIENTS } from '../../constants';

// Mock CKEditor global
(window as any).ClassicEditor = {
  create: vi.fn().mockResolvedValue({
    setData: vi.fn(),
    getData: vi.fn().mockReturnValue('<p>Test Note Content</p>'),
    destroy: vi.fn().mockResolvedValue(null),
    model: {
      document: {
        on: vi.fn()
      }
    }
  })
};

describe('PatientProfileView', () => {
  const mockOnBack = vi.fn();
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and defaults to Care Plan tab', () => {
    render(
      <PatientProfileView 
        patients={MOCK_PATIENTS} 
        selectedId="1" 
        onBack={mockOnBack} 
        language="EN" 
        onPatientSelect={mockOnSelect} 
      />
    );
    expect(screen.getByText(/Active Evaluation/i)).toBeInTheDocument();
    expect(screen.getByText(/Vitals History Log/i)).toBeInTheDocument();
  });

  it('switches between tabs and shows correct content', () => {
    render(
      <PatientProfileView 
        patients={MOCK_PATIENTS} 
        selectedId="1" 
        onBack={mockOnBack} 
        language="EN" 
      />
    );

    // Overview Tab
    fireEvent.click(screen.getByText('Overview'));
    expect(screen.getByText(/Patient Health Summary/i)).toBeInTheDocument();
    expect(screen.getByText(/UNIFIED SCORE/i)).toBeInTheDocument();

    // Medications Tab
    fireEvent.click(screen.getByText('Medications'));
    expect(screen.getByText(/Current Medications/i)).toBeInTheDocument();
    expect(screen.getByText(/Amoxicillin/i)).toBeInTheDocument();

    // Labs Tab
    fireEvent.click(screen.getByText('Labs'));
    expect(screen.getByText(/Laboratory Reports/i)).toBeInTheDocument();
    expect(screen.getByText(/Full Blood Count/i)).toBeInTheDocument();
  });

  it('handles medication filtering', () => {
    render(
      <PatientProfileView 
        patients={MOCK_PATIENTS} 
        selectedId="1" 
        onBack={mockOnBack} 
        language="EN" 
      />
    );

    fireEvent.click(screen.getByText('Medications'));
    
    const filterBtn = screen.getByText(/Active/i);
    fireEvent.click(filterBtn);
    
    // Select Inactive
    const inactiveOption = screen.getByText('Inactive');
    fireEvent.click(inactiveOption);
    
    // Should show no medications as they are all active by default in mock
    expect(screen.queryByText(/Amoxicillin/i)).not.toBeInTheDocument();
  });

  it('opens log vitals modal and submits data', async () => {
    render(
      <PatientProfileView 
        patients={MOCK_PATIENTS} 
        selectedId="1" 
        onBack={mockOnBack} 
        language="EN" 
      />
    );

    const logBtn = screen.getByText(/LOG VITALS/i);
    fireEvent.click(logBtn);

    expect(screen.getByText(/Log Vitals/i)).toBeInTheDocument();
    
    const hrInput = screen.getByPlaceholderText(/Heart Rate/i);
    fireEvent.change(hrInput, { target: { value: '85' } });
    
    const submitBtn = screen.getByText(/SAVE VITALS/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.queryByText(/Log Vitals/i)).not.toBeInTheDocument();
    });
  });

  it('toggles lab view mode between Grid and List', () => {
    render(
      <PatientProfileView 
        patients={MOCK_PATIENTS} 
        selectedId="1" 
        onBack={mockOnBack} 
        language="EN" 
      />
    );

    fireEvent.click(screen.getByText('Labs'));
    
    // Find view toggle buttons
    const toggles = screen.getAllByRole('button').filter(b => b.querySelector('svg'));
    // The list toggle is typically the second in that group
    fireEvent.click(toggles[3]); // List mode
    
    expect(screen.getByText(/Report Title/i)).toBeInTheDocument();
    expect(screen.getByText(/Physician/i)).toBeInTheDocument();
  });
});