// hooks/usePokemonQueries.ts
import { useQuery, useQueries, useQueryClient } from '@tanstack/react-query';
import { fetchPokemonList, fetchPokemonDetails } from '../api/api';

export const queryKeys = {
  pokemonList: (page: number) => ['pokemon', 'list', page] as const,
  pokemonDetails: (name: string) => ['pokemon', 'details', name] as const,
  pokemonSearch: (term: string) => ['pokemon', 'search', term] as const,
  allPokemon: () => ['pokemon'] as const,
};

export function usePokemonList(page: number, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.pokemonList(page),
    queryFn: () => fetchPokemonList(page),
    enabled: enabled,
  });
}

export function usePokemonDetails(name: string, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.pokemonDetails(name),
    queryFn: () => fetchPokemonDetails(name),
    enabled: !!name && enabled,
  });
}

export function usePokemonSearch(searchTerm: string) {
  return useQuery({
    queryKey: queryKeys.pokemonSearch(searchTerm),
    queryFn: () => fetchPokemonDetails(searchTerm),
    enabled: !!searchTerm && searchTerm.length > 0,
    retry: false, 
  });
}

export function useMultiplePokemonDetails(names: string[]) {
  return useQueries({
    queries: names.map((name) => ({
      queryKey: queryKeys.pokemonDetails(name),
      queryFn: () => fetchPokemonDetails(name),
    })),
  });
}

export function useInvalidateCache() {
  const queryClient = useQueryClient();

  const invalidatePokemonList = async (page?: number) => {
    if (page) {
      await queryClient.invalidateQueries({ queryKey: queryKeys.pokemonList(page) });
    } else {
      await queryClient.invalidateQueries({ queryKey: ['pokemon', 'list'] });
    }
  };

  const invalidatePokemonDetails = async (name?: string) => {
    if (name) {
      await queryClient.invalidateQueries({ queryKey: queryKeys.pokemonDetails(name) });
    } else {
      await queryClient.invalidateQueries({ queryKey: ['pokemon', 'details'] });
    }
  };

  const refetchPokemonList = async (page: number) => {
    await queryClient.refetchQueries({ queryKey: queryKeys.pokemonList(page) });
  };

  const refetchPokemonDetails = async (name: string) => {
    await queryClient.refetchQueries({ queryKey: queryKeys.pokemonDetails(name) });
  };

  return {
    invalidatePokemonList,
    invalidatePokemonDetails,
    refetchPokemonList,
    refetchPokemonDetails,
  };
}