import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { About } from '../pages/About';

describe('About Page', () => {
  it('displays author info and RS School link', () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );
    expect(screen.getByText(/author/i)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /RS School React Course/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
  });
});