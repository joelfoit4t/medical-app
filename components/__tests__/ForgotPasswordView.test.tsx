
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ForgotPasswordView } from '../ForgotPasswordView';

describe('ForgotPasswordView', () => {
  const mockOnBackClick = vi.fn();

  it('renders initial recovery state', () => {
    render(<ForgotPasswordView onBackClick={mockOnBackClick} />);
    expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/clara.redfield@medicare.com/i)).toBeInTheDocument();
  });

  it('shows success message after email submission', async () => {
    render(<ForgotPasswordView onBackClick={mockOnBackClick} />);
    
    fireEvent.change(screen.getByPlaceholderText(/clara.redfield@medicare.com/i), {
      target: { value: 'recover@medicare.com' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Send Reset Instructions/i }));

    await waitFor(() => {
      expect(screen.getByText(/Instructions Sent/i)).toBeInTheDocument();
      expect(screen.getByText(/recover@medicare.com/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
