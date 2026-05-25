import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Details } from '../pages/Details';
import * as api from '../api/api';

vi.mock('../api/api');

const mockFetchPokemonDetails = vi.mocked(api.fetchPokemonDetails);

describe('Details Page', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const renderDetails = (pokemonName = 'pikachu') =>
    render(
      <MemoryRouter initialEntries={[`/details/${pokemonName}?page=1`]}>
        <Routes>
          <Route path="/details/:id" element={<Details />} />
        </Routes>
      </MemoryRouter>
    );

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
      expect(screen.getByText(/Failed to load details/i)).toBeInTheDocument();
    });
  });

  it('closes details when close button is clicked', async () => {
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
    expect(closeBtn).toBeInTheDocument();
  });
});