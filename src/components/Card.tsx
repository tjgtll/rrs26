import React from 'react';
import type { Pokemon } from '../types';
import { useSelectedStore } from '../store/store';

interface CardProps {
  pokemon: Pokemon;
  onClick: (name: string) => void; 
}

export const Card: React.FC<CardProps> = ({ pokemon, onClick }) => {
  const { name } = pokemon;
  const selected = useSelectedStore((state) => state.selected.has(name));
  const toggleSelect = useSelectedStore((state) => state.toggleSelect);

  const handleCheckboxChange = () => {
    toggleSelect(name);
  };

  const handleCardClick = () => {
    onClick(name);
  };

  return (
    <div className="card" onClick={handleCardClick}>
      <input
        type="checkbox"
        checked={selected}
        onChange={handleCheckboxChange}
        onClick={(e) => e.stopPropagation()}  
        className="card-checkbox"
      />
      <div className="card-name">{name.toUpperCase()}</div>
    </div>
  );
};