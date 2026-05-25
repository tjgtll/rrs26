import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Card } from '../components/Card';
import type { Pokemon } from '../types';
import { useSelectedStore } from '../store/store';

describe('Card', () => {
  const pokemon: Pokemon = { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' };
  const mockOnClick = vi.fn();

  beforeEach(() => {
    const { unselectAll } = useSelectedStore.getState();
    unselectAll();
    vi.clearAllMocks();
  });

  it('shows pokemon name in uppercase', () => {
    render(<Card pokemon={pokemon} onClick={mockOnClick} />);
    expect(screen.getByText('PIKACHU')).toBeInTheDocument();
  });

  it('calls onClick when clicking on the card (not checkbox)', async () => {
    render(<Card pokemon={pokemon} onClick={mockOnClick} />);
    await userEvent.click(screen.getByText('PIKACHU'));
    expect(mockOnClick).toHaveBeenCalledWith('pikachu');
  });

  it('toggles selection when clicking on checkbox', async () => {
    render(<Card pokemon={pokemon} onClick={mockOnClick} />);
    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);
    const { selected } = useSelectedStore.getState();
    expect(selected.has('pikachu')).toBe(true);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('displays checkbox as checked when item is selected', () => {
    const { toggleSelect } = useSelectedStore.getState();
    toggleSelect('pikachu');
    render(<Card pokemon={pokemon} onClick={mockOnClick} />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('displays checkbox as unchecked when item is not selected', () => {
    render(<Card pokemon={pokemon} onClick={mockOnClick} />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });
});