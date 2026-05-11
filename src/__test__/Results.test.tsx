import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Results } from '../components/Results';
import type { Vehicle } from '../types';

describe('Results', () => {
  const vehicles: Vehicle[] = [{ id: 1, make_id: 22, make: 'Toyota', name: 'Camry' }];

  it('shows list of cars', () => {
    render(<Results items={vehicles} error={null} />);
    expect(screen.getByText('Camry')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<Results items={[]} error="API failed" />);
    expect(screen.getByText('API failed')).toBeInTheDocument();
  });

  it('shows "Error description" when no data', () => {
    render(<Results items={[]} error={null} />);
    expect(screen.getByText('Error description')).toBeInTheDocument();
  });
});