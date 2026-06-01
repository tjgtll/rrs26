import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { UseQueryResult } from '@tanstack/react-query';
import type { PokemonDetails } from '../types';
import { usePokemonList, usePokemonDetails, usePokemonSearch, useMultiplePokemonDetails, useInvalidateCache, queryKeys } from '../hooks/usePokemonQueries';
import * as api from '../api/api';

vi.mock('../api/api');

const mockFetchPokemonList = vi.mocked(api.fetchPokemonList);
const mockFetchPokemonDetails = vi.mocked(api.fetchPokemonDetails);

const createTestQueryClient = () => new QueryClient({
  defaultOptions: { queries: { retry: false, gcTime: 0 } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>{children}</QueryClientProvider>
);

describe('usePokemonList', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns loading state initially', () => {
    mockFetchPokemonList.mockImplementation(() => new Promise(() => {}));
    const { result } = renderHook(() => usePokemonList(1), { wrapper });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('fetches and returns data successfully', async () => {
    const mockData = { results: [{ name: 'pikachu', url: '' }], count: 1 };
    mockFetchPokemonList.mockResolvedValue(mockData);
    const { result } = renderHook(() => usePokemonList(1), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
    expect(mockFetchPokemonList).toHaveBeenCalledWith(1);
  });

  it('handles error', async () => {
    mockFetchPokemonList.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => usePokemonList(1), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Network error');
  });

  it('caches data and does not refetch for same page', async () => {
    const mockData = { results: [{ name: 'pikachu', url: '' }], count: 1 };
    mockFetchPokemonList.mockResolvedValue(mockData);
    const { result, rerender } = renderHook(() => usePokemonList(1), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockFetchPokemonList).toHaveBeenCalledTimes(1);
    rerender();
    expect(mockFetchPokemonList).toHaveBeenCalledTimes(1);
  });
});

describe('usePokemonDetails', () => {
  it('caches details', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    
    const mockDetails = { id: 25, name: 'pikachu', height: 4, weight: 60, sprites: { other: { 'official-artwork': { front_default: '' } } } };
    mockFetchPokemonDetails.mockResolvedValue(mockDetails);
    
    const { rerender } = renderHook(() => usePokemonDetails('pikachu'), { wrapper });
    await waitFor(() => expect(mockFetchPokemonDetails).toHaveBeenCalledTimes(1));
    rerender();
    expect(mockFetchPokemonDetails).toHaveBeenCalledTimes(1);
  });
});

describe('usePokemonSearch', () => {
  it('enabled only when searchTerm not empty', () => {
    const { result, rerender } = renderHook(({ term }) => usePokemonSearch(term), {
      wrapper,
      initialProps: { term: '' },
    });
    expect(result.current.isLoading).toBe(false);
    rerender({ term: 'pikachu' });
    expect(result.current.isLoading).toBe(true);
  });
});

describe('useMultiplePokemonDetails', () => {
  it('fetches multiple pokemon in parallel', async () => {
    const mockPikachu = { id: 25, name: 'pikachu', height: 4, weight: 60, sprites: { other: { 'official-artwork': { front_default: '' } } } };
    const mockCharizard = { id: 6, name: 'charizard', height: 17, weight: 905, sprites: { other: { 'official-artwork': { front_default: '' } } } };
    mockFetchPokemonDetails.mockImplementation((name: string) => {
      if (name === 'pikachu') return Promise.resolve(mockPikachu);
      return Promise.resolve(mockCharizard);
    });
    const { result } = renderHook(() => useMultiplePokemonDetails(['pikachu', 'charizard']), { wrapper });
    await waitFor(() => {
     expect(result.current.every((q: UseQueryResult<PokemonDetails, Error>) => q.isSuccess)).toBe(true);
    });
    expect(result.current[0].data?.name).toBe('pikachu');
    expect(result.current[1].data?.name).toBe('charizard');
  });
});

describe('useInvalidateCache', () => {
  it('invalidates pokemon list cache', async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(queryKeys.pokemonList(1), { results: [], count: 0 });
    expect(queryClient.getQueryData(queryKeys.pokemonList(1))).toBeDefined();
    
    const { result } = renderHook(() => useInvalidateCache(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });
    
    await act(async () => {
      await result.current.invalidatePokemonList(1);
    });
    
    const state = queryClient.getQueryState(queryKeys.pokemonList(1));
    expect(state?.isInvalidated).toBe(true);
  });

  it('refetches pokemon list', async () => {
    const mockFetch = vi.mocked(api.fetchPokemonList).mockResolvedValue({ results: [], count: 0 });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const { result } = renderHook(() => useInvalidateCache(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });
    
    await act(async () => {
      await result.current.refetchPokemonList(1);
    });
    
    expect(mockFetch).toHaveBeenCalledWith(1);
  });
});