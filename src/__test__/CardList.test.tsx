import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CardList } from '../components/CardList';
import type { Pokemon } from '../types';

describe('CardList', () => {
  const pokemons: Pokemon[] = [
    { name: 'pikachu', url: '...' },
    { name: 'charizard', url: '...' },
  ];
  const mockOnClick = vi.fn();

  it('renders all cards', () => {
    render(<CardList pokemons={pokemons} onPokemonClick={mockOnClick} />);
    expect(screen.getByText('PIKACHU')).toBeInTheDocument();
    expect(screen.getByText('CHARIZARD')).toBeInTheDocument();
  });

  it('calls onPokemonClick when card clicked', async () => {
    render(<CardList pokemons={pokemons} onPokemonClick={mockOnClick} />);
    await userEvent.click(screen.getByText('PIKACHU'));
    expect(mockOnClick).toHaveBeenCalledWith('pikachu');
  });
});