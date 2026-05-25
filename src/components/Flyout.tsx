import React from 'react';
import { useSelectedStore } from '../store/store';
import type { Pokemon } from '../types';

interface FlyoutProps {
  items: Pokemon[];
}

export const Flyout: React.FC<FlyoutProps> = ({ items }) => {
  const selected = useSelectedStore((state) => state.selected);
  const unselectAll = useSelectedStore((state) => state.unselectAll);
  const selectedCount = selected.size;

  if (selectedCount === 0) return null;

  const handleDownload = () => {
    const selectedItems = items.filter((p) => selected.has(p.name));

    const rows = [
      ['Name', 'URL', 'Description'],
      ...selectedItems.map((p) => [p.name, p.url, '']),
    ];

    const csvContent = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedCount}_items.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flyout">
      <span>{selectedCount} item(s) selected</span>
      <button onClick={unselectAll}>Unselect all</button>
      <button onClick={handleDownload}>Download</button>
    </div>
  );
};