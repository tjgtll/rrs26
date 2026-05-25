import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Loader } from '../components/Loader';

describe('Loader', () => {
  it('shows loading spinner', () => {
    const { container } = render(<Loader />);
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });
});