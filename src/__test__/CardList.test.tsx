import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CardList } from '../components/CardList';
import type { Vehicle } from '../types';

describe('CardList', () => {
  const vehicles: Vehicle[] = [
    { id: 1, make_id: 22, make: 'Toyota', name: 'Corolla' },
    { id: 2, make_id: 22, make: 'Toyota', name: 'Camry' },
  ];

  it('shows table headers and all cars', () => {
    render(<CardList vehicles={vehicles} />);
    expect(screen.getByText('Make')).toBeInTheDocument();
    expect(screen.getByText('Model')).toBeInTheDocument();
    expect(screen.getByText('Corolla')).toBeInTheDocument();
    expect(screen.getByText('Camry')).toBeInTheDocument();
  });
});