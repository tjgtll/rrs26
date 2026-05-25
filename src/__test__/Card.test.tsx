import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Card } from '../components/Card';
import type { Pokemon } from '../types';

describe('Card', () => {
  const pokemon: Pokemon = { name: 'pikachu', url: '...' };
  const mockOnClick = vi.fn();

  it('shows pokemon name', () => {
    render(<Card pokemon={pokemon} onClick={mockOnClick} />);
    expect(screen.getByText('PIKACHU')).toBeInTheDocument(); 
  });

  it('calls onClick with name when clicked', async () => {
    render(<Card pokemon={pokemon} onClick={mockOnClick} />);
    await userEvent.click(screen.getByText('PIKACHU'));
    expect(mockOnClick).toHaveBeenCalledWith('pikachu');
  });
});