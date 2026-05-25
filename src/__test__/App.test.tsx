import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { ThemeProvider } from '../contexts/ThemeProvider';  
import App from '../App';

describe('App', () => {
  it('renders navigation links', () => {
    render(
      <ThemeProvider>  
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    );
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  });
});