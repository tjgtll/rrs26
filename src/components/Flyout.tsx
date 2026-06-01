import React from 'react';
import { useSelectedStore } from '../store/store';
import { useMultiplePokemonDetails } from '../hooks/usePokemonQueries';
import type { Pokemon } from '../types';

interface FlyoutProps {
  items: Pokemon[];
}

export const Flyout: React.FC<FlyoutProps> = () => {
  const selected = useSelectedStore((state) => state.selected);
  const unselectAll = useSelectedStore((state) => state.unselectAll);
  const selectedCount = selected.size;

  const selectedNames = Array.from(selected);
  const detailsQueries = useMultiplePokemonDetails(selectedNames);
  
  const isLoading = detailsQueries.some(query => query.isLoading);
  const allDetails = detailsQueries.map(query => query.data).filter(Boolean);

  if (selectedCount === 0) return null;

  const handleDownload = () => {
    const rows = [
      ['Name', 'ID', 'Height (m)', 'Weight (kg)', 'URL'],
      ...allDetails.map((details) => [
        details?.name?.toUpperCase() || '',
        details?.id || '',
        details?.height ? details.height / 10 : '',
        details?.weight ? details.weight / 10 : '',
        `https://pokeapi.co/api/v2/pokemon/${details?.id}/`,
      ]),
    ];

    const csvContent = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pokemon_${selectedCount}_items.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flyout">
      <span>{selectedCount} item(s) selected</span>
      <button onClick={unselectAll}>Unselect all</button>
      <button onClick={handleDownload} disabled={isLoading}>
        {isLoading ? 'Loading data...' : 'Download CSV'}
      </button>
    </div>
  );
};