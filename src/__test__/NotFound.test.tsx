import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { NotFound } from '../pages/NotFound';

describe('NotFound Page', () => {
  it('displays 404 message and link to home', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );
    expect(screen.getByText(/404/i)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /return to home/i });
    expect(link).toBeInTheDocument();
  });
});