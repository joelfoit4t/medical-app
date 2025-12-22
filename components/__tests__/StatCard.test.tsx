
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StatCard } from '../StatCard';
import { Users } from 'lucide-react';

describe('StatCard', () => {
  it('renders label and value', () => {
    render(<StatCard label="Total Items" value={150} icon={Users} colorClass="bg-red-500" />);
    expect(screen.getByText(/Total Items/i)).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('triggers onClick when clicked', () => {
    const mockClick = vi.fn();
    render(<StatCard label="Click Me" value={10} icon={Users} colorClass="bg-blue-500" onClick={mockClick} />);
    fireEvent.click(screen.getByText(/Click Me/i));
    expect(mockClick).toHaveBeenCalled();
  });

  it('applies active styles when isActive is true', () => {
    const { container } = render(<StatCard label="Active" value={5} icon={Users} colorClass="bg-green-500" isActive={true} />);
    expect(container.firstChild).toHaveClass('border-emerald-500');
  });
});
