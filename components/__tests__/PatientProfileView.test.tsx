import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PatientProfileView } from '../PatientProfileView';
import { MOCK_PATIENTS } from '../../constants';

// Mock CKEditor global
(window as any).ClassicEditor = {
  create: vi.fn().mockResolvedValue({
    setData: vi.fn(),
    getData: vi.fn().mockReturnValue('<p>New evaluation note content</p>'),
    destroy: vi.fn().mockResolvedValue(null),
    model: {
      document: {
        on: vi.fn((event, cb) => {
          // No-op for mock
        })
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

  it('allows adding a new clinical evaluation note', async () => {
    render(
      <PatientProfileView 
        patients={MOCK_PATIENTS} 
        selectedId="1" 
        onBack={mockOnBack} 
        language="EN" 
      />
    );

    // Initial state check
    expect(screen.getByText(/Evaluation Notes/i)).toBeInTheDocument();
    
    // Simulate Save Entry click (content is mocked from CKEditor)
    const saveBtn = screen.getByRole('button', { name: /SAVE ENTRY/i });
    fireEvent.click(saveBtn);

    // Mock timeout for saving simulation
    await waitFor(() => {
      expect(screen.getByText(/New evaluation note content/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('allows deleting an evaluation note', async () => {
    render(
      <PatientProfileView 
        patients={MOCK_PATIENTS} 
        selectedId="1" 
        onBack={mockOnBack} 
        language="EN" 
      />
    );

    // Find a delete button in the history log
    const deleteBtns = screen.getAllByTitle(/Delete Note/i);
    const initialNotesCount = deleteBtns.length;
    
    fireEvent.click(deleteBtns[0]);
    
    expect(screen.getAllByTitle(/Delete Note/i).length).toBe(initialNotesCount - 1);
  });

  it('navigates to Medications tab and edits a dosage', () => {
    render(
      <PatientProfileView 
        patients={MOCK_PATIENTS} 
        selectedId="1" 
        onBack={mockOnBack} 
        language="EN" 
      />
    );

    fireEvent.click(screen.getByText('Medications'));
    
    // Open action menu for first medication
    const moreBtn = screen.getAllByRole('button').find(b => b.innerHTML.includes('svg'));
    if (moreBtn) fireEvent.click(moreBtn);
    
    const editBtn = screen.getByText(/Edit Dosage/i);
    fireEvent.click(editBtn);
    
    expect(screen.getByText(/Edit Medication/i)).toBeInTheDocument();
    
    const strengthInput = screen.getByLabelText(/Strength/i);
    fireEvent.change(strengthInput, { target: { value: '1000MG' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));
    expect(screen.getByText('1000MG')).toBeInTheDocument();
  });
});