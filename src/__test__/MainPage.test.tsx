import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MainPage } from '../pages/MainPage';
import { ThemeProvider } from '../contexts/ThemeProvider';
import * as api from '../api/api';

vi.mock('../api/api');

const mockFetchPokemonList = vi.mocked(api.fetchPokemonList);
const mockFetchPokemonDetails = vi.mocked(api.fetchPokemonDetails);

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

const renderMainPage = () => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<MainPage />}>
              <Route path="details/:id" element={<div>Details Mock</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('MainPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockFetchPokemonList.mockResolvedValue({
      results: [
        { name: 'pikachu', url: '' },
        { name: 'bulbasaur', url: '' },
      ],
      count: 20,
    });
  });

  it('displays list of pokemons', async () => {
    renderMainPage();
    await waitFor(() => {
      expect(screen.getByText('PIKACHU')).toBeInTheDocument();
      expect(screen.getByText('BULBASAUR')).toBeInTheDocument();
    });
  });

  it('shows loader while fetching', () => {
    mockFetchPokemonList.mockImplementation(() => new Promise(() => {}));
    renderMainPage();
    expect(document.querySelector('.loader')).toBeInTheDocument();
  });

  it('shows error message when API fails', async () => {
    mockFetchPokemonList.mockRejectedValue(new Error('Failed to fetch'));
    renderMainPage();
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
    });
  });

  it('performs search and shows error if not found', async () => {
    mockFetchPokemonDetails.mockRejectedValue(new Error('Not found'));
    renderMainPage();
    await waitFor(() => screen.getByText('PIKACHU'));
    const searchInput = screen.getByRole('textbox');
    await userEvent.type(searchInput, 'unknown');
    await userEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText(/not found/i)).toBeInTheDocument();
    });
  });

  it('navigates to details when pokemon clicked', async () => {
    renderMainPage();
    await waitFor(() => screen.getByText('PIKACHU'));
    await userEvent.click(screen.getByText('PIKACHU'));
    await waitFor(() => {
      expect(screen.getByText('Details Mock')).toBeInTheDocument();
    });
  });

  it('refresh button invalidates cache and refetches', async () => {
    renderMainPage();
    await waitFor(() => screen.getByText('PIKACHU'));
    expect(mockFetchPokemonList).toHaveBeenCalledTimes(1);
    const refreshBtn = screen.getByRole('button', { name: /refresh/i });
    await userEvent.click(refreshBtn);
    await waitFor(() => {
      expect(mockFetchPokemonList).toHaveBeenCalledTimes(2);
    });
  });
});
