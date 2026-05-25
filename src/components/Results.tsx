import React from 'react';
import type { Pokemon } from '../types';
import { CardList } from './CardList';

interface ResultsProps {
  items: Pokemon[];
  error: string | null;
  onItemClick: (name: string) => void;
}

export const Results: React.FC<ResultsProps> = ({ items, error, onItemClick }) => {
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  if (items.length === 0) {
    return <div className="empty-state">No Pokémon found</div>;
  }
  return <CardList pokemons={items} onPokemonClick={onItemClick} />;
};