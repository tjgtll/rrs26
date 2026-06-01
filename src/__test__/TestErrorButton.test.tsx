import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TestErrorButton } from '../components/TestErrorButton';

describe('TestErrorButton', () => {
  it('throws error on click', async () => {
    render(<TestErrorButton />);
    const btn = screen.getByRole('button');
    await expect(userEvent.click(btn)).rejects.toThrow();
  });
});