
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SignInView } from '../SignInView';

describe('SignInView', () => {
  const mockOnSignIn = vi.fn();
  const mockOnSignUpClick = vi.fn();
  const mockOnForgotPasswordClick = vi.fn();

  it('renders login form correctly', () => {
    render(
      <SignInView 
        onSignIn={mockOnSignIn} 
        onSignUpClick={mockOnSignUpClick} 
        onForgotPasswordClick={mockOnForgotPasswordClick} 
      />
    );
    
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/clara.redfield@medicare.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••••••/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enter Dashboard/i })).toBeInTheDocument();
  });

  it('calls onSignIn after successful submission', async () => {
    render(
      <SignInView 
        onSignIn={mockOnSignIn} 
        onSignUpClick={mockOnSignUpClick} 
        onForgotPasswordClick={mockOnForgotPasswordClick} 
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/clara.redfield@medicare.com/i), {
      target: { value: 'test@medicare.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••••••/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Enter Dashboard/i }));

    // Form has a simulated 1200ms delay
    await waitFor(() => expect(mockOnSignIn).toHaveBeenCalled(), { timeout: 2000 });
  });

  it('triggers navigation callbacks', () => {
    render(
      <SignInView 
        onSignIn={mockOnSignIn} 
        onSignUpClick={mockOnSignUpClick} 
        onForgotPasswordClick={mockOnForgotPasswordClick} 
      />
    );

    fireEvent.click(screen.getByText(/Register now/i));
    expect(mockOnSignUpClick).toHaveBeenCalled();

    fireEvent.click(screen.getByText(/Forgot\?/i));
    expect(mockOnForgotPasswordClick).toHaveBeenCalled();
  });
});
