import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { ErrorBoundary } from '../components/ErrorBoundary';

const Buggy = () => { throw new Error('Test error'); };

describe('ErrorBoundary', () => {
  beforeAll(() => vi.spyOn(console, 'error').mockImplementation(() => {}));
  afterAll(() => vi.restoreAllMocks());

  it('shows error screen when something breaks', () => {
    render(
      <ErrorBoundary>
        <Buggy />
      </ErrorBoundary>
    );
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /again/i })).toBeInTheDocument();
  });
});