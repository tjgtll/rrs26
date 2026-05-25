import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Flyout } from '../components/Flyout';
import type { Pokemon } from '../types';
import { useSelectedStore } from '../store/store';

const mockItems: Pokemon[] = [
  { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
  { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
];

describe('Flyout', () => {
  beforeEach(() => {
    useSelectedStore.getState().unselectAll();
  });

  it('does not render when no items selected', () => {
    const { container } = render(<Flyout items={mockItems} />);
    expect(container.firstChild).toBeNull();
  });

  it('displays number of selected items', () => {
    useSelectedStore.getState().toggleSelect('pikachu');
    render(<Flyout items={mockItems} />);
    expect(screen.getByText(/1 item\(s\) selected/i)).toBeInTheDocument();
  });

  it('calls unselectAll when button is clicked', () => {
    useSelectedStore.getState().toggleSelect('pikachu');
    const unselectAllSpy = vi.spyOn(useSelectedStore.getState(), 'unselectAll');
    render(<Flyout items={mockItems} />);
    fireEvent.click(screen.getByText(/Unselect all/i));
    expect(unselectAllSpy).toHaveBeenCalled();
  });

  it('downloads CSV with correct file name', () => {
    const createObjectURLSpy = vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:url');
    const revokeObjectURLSpy = vi.spyOn(window.URL, 'revokeObjectURL');

    useSelectedStore.getState().toggleSelect('pikachu');
    render(<Flyout items={mockItems} />);
    fireEvent.click(screen.getByText(/Download/i));

    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalled();

    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
  });
});