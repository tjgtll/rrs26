import React from 'react';
import type { Pokemon } from '../types';
import { Card } from './Card';

interface CardListProps {
  pokemons: Pokemon[];
  onPokemonClick: (name: string) => void;
}

export const CardList: React.FC<CardListProps> = ({ pokemons, onPokemonClick }) => {
  return (
    <div className="card-list">
      {pokemons.map((pokemon) => (
        <Card key={pokemon.name} pokemon={pokemon} onClick={onPokemonClick} />
      ))}
    </div>
  );
};