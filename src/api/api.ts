import type { Pokemon, PokemonDetails } from '../types';

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemonList(page: number = 1): Promise<{ results: Pokemon[]; count: number }> {
  const limit = 10;
  const offset = (page - 1) * limit;
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) throw new Error('Failed to fetch Pokémon list');
  const data = await response.json();
  return { results: data.results, count: data.count };
}

export async function fetchPokemonDetails(name: string): Promise<PokemonDetails> {
  const response = await fetch(`${BASE_URL}/pokemon/${name.toLowerCase()}`);
  if (!response.ok) throw new Error(`Pokémon "${name}" not found`);
  return response.json();
}