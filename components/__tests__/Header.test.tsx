
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '../Header';

describe('Header', () => {
  const mockOnMenuClick = vi.fn();
  const mockOnLanguageChange = vi.fn();
  const mockOnLogout = vi.fn();

  it('renders correctly with active navigation title', () => {
    render(
      <Header 
        activeNav="Staff" 
        onMenuClick={mockOnMenuClick} 
        language="EN" 
        onLanguageChange={mockOnLanguageChange} 
        onLogout={mockOnLogout} 
      />
    );
    expect(screen.getByText(/Staff/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search../i)).toBeInTheDocument();
  });

  it('opens profile dropdown and triggers logout', () => {
    render(
      <Header 
        activeNav="Dashboard" 
        onMenuClick={mockOnMenuClick} 
        language="EN" 
        onLanguageChange={mockOnLanguageChange} 
        onLogout={mockOnLogout} 
      />
    );
    const profileBtn = screen.getByAltText(/Dr. Clara/i);
    fireEvent.click(profileBtn);
    
    expect(screen.getByText(/Signed in as/i)).toBeInTheDocument();
    const logoutBtn = screen.getByText(/Logout/i);
    fireEvent.click(logoutBtn);
    expect(mockOnLogout).toHaveBeenCalled();
  });

  it('opens language dropdown and selects French', () => {
    render(
      <Header 
        activeNav="Dashboard" 
        onMenuClick={mockOnMenuClick} 
        language="EN" 
        onLanguageChange={mockOnLanguageChange} 
        onLogout={mockOnLogout} 
      />
    );
    const langBtn = screen.getByText('EN');
    fireEvent.click(langBtn);
    
    const frBtn = screen.getByText(/Français/i);
    fireEvent.click(frBtn);
    expect(mockOnLanguageChange).toHaveBeenCalledWith('FR');
  });
});
