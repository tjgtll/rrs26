import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Details } from '../pages/Details';
import * as api from '../api/api';

vi.mock('../api/api');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const mockFetchPokemonDetails = vi.mocked(api.fetchPokemonDetails);
const mockUseNavigate = vi.mocked(useNavigate);

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

const renderDetails = (
  pokemonName = 'pikachu',
  initialEntries = [`/details/${pokemonName}?page=1`]
) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/details/:id" element={<Details />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('Details Page', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockUseNavigate.mockReturnValue(vi.fn());
  });

  it('shows loader while fetching', () => {
    mockFetchPokemonDetails.mockImplementation(() => new Promise(() => {}));
    renderDetails();
    expect(document.querySelector('.loader')).toBeInTheDocument();
  });

  it('displays pokemon details after successful fetch', async () => {
    mockFetchPokemonDetails.mockResolvedValue({
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      sprites: { other: { 'official-artwork': { front_default: 'url' } } },
    });
    renderDetails();
    await waitFor(() => {
      expect(screen.getByText('PIKACHU')).toBeInTheDocument();
    });
    expect(screen.getByText(/height/i).parentElement).toHaveTextContent('0.4');
    expect(screen.getByText(/weight/i).parentElement).toHaveTextContent('6');
    expect(screen.getByText(/id/i).parentElement).toHaveTextContent('25');
  });

  it('shows error message when pokemon not found', async () => {
    mockFetchPokemonDetails.mockRejectedValue(new Error('Not found'));
    renderDetails('unknown');
    await waitFor(() => {
      expect(screen.getByText(/failed to load details/i)).toBeInTheDocument();
    });
  });

  it('closes details when close button is clicked', async () => {
    const navigateMock = vi.fn();
    mockUseNavigate.mockReturnValue(navigateMock);
    mockFetchPokemonDetails.mockResolvedValue({
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      sprites: { other: { 'official-artwork': { front_default: 'url' } } },
    });
    renderDetails();
    await waitFor(() => screen.getByText('PIKACHU'));
    const closeBtn = screen.getByRole('button', { name: '✕' });
    await userEvent.click(closeBtn);
    expect(navigateMock).toHaveBeenCalled();
  });

  it('refresh button refetches data', async () => {
    mockFetchPokemonDetails.mockResolvedValue({
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      sprites: { other: { 'official-artwork': { front_default: 'url' } } },
    });
    renderDetails();
    await waitFor(() => screen.getByText('PIKACHU'));
    const initialCalls = mockFetchPokemonDetails.mock.calls.length;
    const refreshBtn = screen.getByRole('button', { name: /refresh/i });
    await userEvent.click(refreshBtn);
    await waitFor(() => {
      expect(mockFetchPokemonDetails.mock.calls.length).toBe(initialCalls + 1);
    });
  });
});
