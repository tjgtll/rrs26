import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Search } from '../components/Search';

describe('Search Component', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders input and button', () => {
    render(<Search initialSearchTerm="" onSearch={mockOnSearch} isLoading={false} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('displays saved search term from localStorage on mount', () => {
    localStorage.setItem('carSearchTerm', 'Toyota');
    render(<Search initialSearchTerm="Toyota" onSearch={mockOnSearch} isLoading={false} />);
    expect(screen.getByRole('textbox')).toHaveValue('Toyota');
  });

  it('shows empty input when no saved term', () => {
    render(<Search initialSearchTerm="" onSearch={mockOnSearch} isLoading={false} />);
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('updates input value on user typing', async () => {
    render(<Search initialSearchTerm="" onSearch={mockOnSearch} isLoading={false} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Honda');
    expect(input).toHaveValue('Honda');
  });

  it('does not call onSearch if same ', async () => {
    render(<Search initialSearchTerm="Toyota" onSearch={mockOnSearch} isLoading={false} />);
    const input = screen.getByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, 'Toyota');
    const button = screen.getByRole('button', { name: /search/i });
    await userEvent.click(button);
  });

  it('disables input and button when loading', () => {
    render(<Search initialSearchTerm="test" onSearch={mockOnSearch} isLoading={true} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: /searching/i })).toBeDisabled();
  });
});