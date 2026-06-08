import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CountryAutocomplete } from '../components/CountryAutocomplete';
import { describe, it, expect } from 'vitest';
import { useState } from 'react';

describe('CountryAutocomplete', () => {
  const options = ['Belarus', 'USA', 'Canada'];

  const TestWrapper = () => {
    const [value, setValue] = useState('');
    return (
      <CountryAutocomplete
        id="country"
        options={options}
        value={value}
        onSelect={setValue}
      />
    );
  };

  it('filters options based on input', async () => {
    render(<TestWrapper />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'ca');
    await waitFor(() => expect(screen.getByText('Canada')).toBeInTheDocument());
    expect(screen.queryByText('USA')).not.toBeInTheDocument();
    expect(screen.queryByText('Belarus')).not.toBeInTheDocument();
  });

  it('calls onSelect when option clicked', async () => {
    render(<TestWrapper />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'usa');
    await waitFor(() => expect(screen.getByText('USA')).toBeInTheDocument());
    await userEvent.click(screen.getByText('USA'));
    expect(input).toHaveValue('USA');
  });
});
