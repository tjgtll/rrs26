import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider } from '../contexts/ThemeProvider';
import { useTheme } from '../hooks/useTheme';

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

describe('ThemeContext', () => {
  it('provides default theme as light', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
  });

  it('toggles theme from light to dark and back', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    const toggleButton = screen.getByText('Toggle');
    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
    fireEvent.click(toggleButton);
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    fireEvent.click(toggleButton);
    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
  });

  it('applies dark class to document element when theme changes', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    fireEvent.click(screen.getByText('Toggle'));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    fireEvent.click(screen.getByText('Toggle'));
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    document.documentElement.classList.remove('dark');
  });

  it('useTheme returns default value when used outside ThemeProvider', () => {
    const TestWithoutProvider = () => {
      const { theme } = useTheme();
      return <span data-testid="outside-theme">{theme}</span>;
    };
    render(<TestWithoutProvider />);
    expect(screen.getByTestId('outside-theme')).toHaveTextContent('light');
  });
});