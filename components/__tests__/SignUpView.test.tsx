
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SignUpView } from '../SignUpView';

describe('SignUpView', () => {
  const mockOnSignUp = vi.fn();
  const mockOnSignInClick = vi.fn();

  it('renders registration form fields', () => {
    render(<SignUpView onSignUp={mockOnSignUp} onSignInClick={mockOnSignInClick} />);
    
    expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Clara Redfield/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Professional Role/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/clara.redfield@medicare.com/i)).toBeInTheDocument();
  });

  it('submits form and calls onSignUp', async () => {
    render(<SignUpView onSignUp={mockOnSignUp} onSignInClick={mockOnSignInClick} />);

    fireEvent.change(screen.getByPlaceholderText(/Clara Redfield/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/clara.redfield@medicare.com/i), { target: { value: 'john@medicare.com' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Complete Registration/i }));

    await waitFor(() => expect(mockOnSignUp).toHaveBeenCalled(), { timeout: 2000 });
  });

  it('navigates back to login', () => {
    render(<SignUpView onSignUp={mockOnSignUp} onSignInClick={mockOnSignInClick} />);
    fireEvent.click(screen.getByText(/Log in/i));
    expect(mockOnSignInClick).toHaveBeenCalled();
  });
});
