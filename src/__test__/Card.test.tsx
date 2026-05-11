import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from '../components/Card';
import type { Vehicle } from '../types';

describe('Card', () => {
  const vehicle: Vehicle = { id: 1, make_id: 22, make: 'Toyota', name: 'Camry' };

  it('shows car make and model', () => {
    render(<Card vehicle={vehicle} />);
    expect(screen.getByText('Toyota')).toBeInTheDocument();
    expect(screen.getByText('Camry')).toBeInTheDocument();
  });

  it('works when model name is empty', () => {
    const incomplete = { ...vehicle, name: '' };
    render(<Card vehicle={incomplete} />);
    expect(screen.getByText('Toyota')).toBeInTheDocument();
  });
});