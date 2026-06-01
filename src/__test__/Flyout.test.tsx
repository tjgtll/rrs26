import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Flyout } from '../components/Flyout';
import type { Pokemon } from '../types';
import { useSelectedStore } from '../store/store';

vi.mock('../hooks/usePokemonQueries', () => ({
  useMultiplePokemonDetails: vi.fn(() => []),
}));

const mockItems: Pokemon[] = [
  { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
  { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
];

const createTestQueryClient = () => new QueryClient();

const renderFlyout = () => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <Flyout items={mockItems} />
    </QueryClientProvider>
  );
};

describe('Flyout', () => {
  beforeEach(() => {
    useSelectedStore.getState().unselectAll();
    vi.resetAllMocks();
  });

  it('does not render when no items selected', () => {
    const { container } = renderFlyout();
    expect(container.firstChild).toBeNull();
  });

  it('displays number of selected items', () => {
    useSelectedStore.getState().toggleSelect('pikachu');
    renderFlyout();
    expect(screen.getByText(/1 item\(s\) selected/i)).toBeInTheDocument();
  });

  it('calls unselectAll when button is clicked', () => {
    useSelectedStore.getState().toggleSelect('pikachu');
    const unselectAllSpy = vi.spyOn(useSelectedStore.getState(), 'unselectAll');
    renderFlyout();
    fireEvent.click(screen.getByText(/Unselect all/i));
    expect(unselectAllSpy).toHaveBeenCalled();
  });

  it('downloads CSV with correct file name', () => {
    const createObjectURLSpy = vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:url');
    const revokeObjectURLSpy = vi.spyOn(window.URL, 'revokeObjectURL');

    useSelectedStore.getState().toggleSelect('pikachu');
    renderFlyout();
    fireEvent.click(screen.getByText(/Download/i));

    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalled();

    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
  });
});