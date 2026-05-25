import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MainPage } from '../pages/MainPage';
import { ThemeProvider } from '../contexts/ThemeProvider';
import * as api from '../api/api';

vi.mock('../api/api');

const mockFetchPokemonList = vi.mocked(api.fetchPokemonList);
const mockFetchPokemonDetails = vi.mocked(api.fetchPokemonDetails);

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  };
});

describe('MainPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockFetchPokemonList.mockResolvedValue({
      results: [{ name: 'pikachu', url: '' }],
      count: 20,
    });
    mockNavigate.mockClear();
  });

  const renderMainPage = () =>
    render(
      <ThemeProvider>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<MainPage />} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    );

  it('displays list of pokemons', async () => {
    renderMainPage();
    await waitFor(() => {
      expect(screen.getByText('PIKACHU')).toBeInTheDocument();
    });
  });

  it('shows loader while fetching', () => {
    mockFetchPokemonList.mockImplementation(() => new Promise(() => {}));
    renderMainPage();
    expect(document.querySelector('.loader')).toBeInTheDocument();
  });

  it('performs search and shows error if not found', async () => {
    mockFetchPokemonDetails.mockRejectedValue(new Error('Pokémon "unknown" not found'));
    renderMainPage();
    await waitFor(() => expect(screen.getByText('PIKACHU')).toBeInTheDocument());
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
    const pokemonCard = screen.getByText('PIKACHU');
    await userEvent.click(pokemonCard);
    expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('/details/pikachu'));
  });
});