import React from 'react';
import type { Pokemon } from '../types';

interface CardProps {
  pokemon: Pokemon;
  onClick: (name: string) => void;
}

export const Card: React.FC<CardProps> = ({ pokemon, onClick }) => {
  const { name } = pokemon;
  return (
    <div className="card" onClick={() => onClick(name)}>
      <div className="card-name">{name.toUpperCase()}</div>
    </div>
  );
};