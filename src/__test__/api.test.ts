import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchPokemonList, fetchPokemonDetails } from '../api/api';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('Pokemon API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('fetchPokemonList', () => {
    it('calls correct URL with page=1', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ results: [], count: 0 }),
      });
      await fetchPokemonList(1);
      const actualUrl = mockFetch.mock.calls[0][0];
      expect(actualUrl).toContain('https://pokeapi.co/api/v2/pokemon');
      expect(actualUrl).toContain('limit=10');
      expect(actualUrl).toContain('offset=0');
    });

    it('calls correct URL with page=2', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ results: [], count: 0 }),
      });
      await fetchPokemonList(2);
      const actualUrl = mockFetch.mock.calls[0][0];
      expect(actualUrl).toContain('https://pokeapi.co/api/v2/pokemon');
      expect(actualUrl).toContain('limit=10');
      expect(actualUrl).toContain('offset=10');
    });

    it('returns results and count', async () => {
      const mockData = { results: [{ name: 'pikachu', url: '...' }], count: 1 };
      mockFetch.mockResolvedValue({ ok: true, json: async () => mockData });
      const result = await fetchPokemonList(1);
      expect(result).toEqual({ results: mockData.results, count: 1 });
    });

    it('throws error when network fails', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 500 });
      await expect(fetchPokemonList(1)).rejects.toThrow('Failed to fetch Pokémon list');
    });
  });

  describe('fetchPokemonDetails', () => {
    it('calls correct URL for pokemon name', async () => {
      mockFetch.mockResolvedValue({ ok: true, json: async () => ({}) });
      await fetchPokemonDetails('pikachu');
      expect(mockFetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu');
    });

    it('returns pokemon details', async () => {
      const mockDetails = { id: 25, name: 'pikachu', height: 4, weight: 60 };
      mockFetch.mockResolvedValue({ ok: true, json: async () => mockDetails });
      const result = await fetchPokemonDetails('pikachu');
      expect(result).toEqual(mockDetails);
    });

    it('throws error when pokemon not found', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 404 });
      await expect(fetchPokemonDetails('unknown')).rejects.toThrow('Pokémon "unknown" not found');
    });
  });
});