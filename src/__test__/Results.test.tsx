import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Results } from '../components/Results';
import type { Pokemon } from '../types';

describe('Results', () => {
  const mockPokemons: Pokemon[] = [
    { name: 'pikachu', url: '...' },
    { name: 'charizard', url: '...' },
  ];
  const mockOnClick = vi.fn();

  it('shows list of pokemon names', () => {
    render(<Results items={mockPokemons} error={null} onItemClick={mockOnClick} />);
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    expect(screen.getByText(/charizard/i)).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<Results items={[]} error="API failed" onItemClick={mockOnClick} />);
    expect(screen.getByText('API failed')).toBeInTheDocument();
  });

  it('shows empty state when no items and no error', () => {
    render(<Results items={[]} error={null} onItemClick={mockOnClick} />);
    expect(screen.getByText(/no pokémon found/i)).toBeInTheDocument();
  });

  it('calls onItemClick with pokemon name when row clicked', async () => {
    render(<Results items={mockPokemons} error={null} onItemClick={mockOnClick} />);
    const row = screen.getByText(/pikachu/i);
    await userEvent.click(row);
    expect(mockOnClick).toHaveBeenCalledWith('pikachu');
  });
});