import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Search } from '../components/Search';

describe('Search Component', () => {
  const mockOnSearch = vi.fn();

  it('shows input and button', () => {
    render(<Search initialSearchTerm="" onSearch={mockOnSearch} isLoading={false} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('shows saved word from parent', () => {
    render(<Search initialSearchTerm="Toyota" onSearch={mockOnSearch} isLoading={false} />);
    expect(screen.getByRole('textbox')).toHaveValue('Toyota');
  });

  it('changes input when user types', async () => {
    render(<Search initialSearchTerm="" onSearch={mockOnSearch} isLoading={false} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Honda');
    expect(input).toHaveValue('Honda');
  });

it('updates input when parent changes word', () => {
  const { rerender } = render(<Search initialSearchTerm="Pikachu" onSearch={mockOnSearch} isLoading={false} />);
  expect(screen.getByRole('textbox')).toHaveValue('Pikachu');
  rerender(<Search key="CHARIZARD" initialSearchTerm="CHARIZARD" onSearch={mockOnSearch} isLoading={false} />);
  expect(screen.getByRole('textbox')).toHaveValue('CHARIZARD');
});

  it('calls search with trimmed word', async () => {
    render(<Search initialSearchTerm="" onSearch={mockOnSearch} isLoading={false} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '  Pikachu  ');
    const button = screen.getByRole('button', { name: /search/i });
    await userEvent.click(button);
    expect(mockOnSearch).toHaveBeenCalledWith('Pikachu');
  });

  it('disables input and button while loading', () => {
    render(<Search initialSearchTerm="test" onSearch={mockOnSearch} isLoading={true} />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /searching/i });
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });
});