import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import { fetchVehicles } from '../api/api';

vi.mock('../api/api', () => ({
  fetchVehicles: vi.fn(),
}));

const mockedFetchVehicles = vi.mocked(fetchVehicles);

const mockVehicles = [
  { id: 1, make_id: 22, make: 'Toyota', name: 'Camry' },
  { id: 2, make_id: 22, make: 'Toyota', name: 'Corolla' }
];

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Storage.prototype, 'getItem');
    vi.spyOn(Storage.prototype, 'setItem');
    vi.spyOn(Storage.prototype, 'clear');
    localStorage.clear();
  });
  
  it('shows error message when API fails', async () => {
    mockedFetchVehicles.mockRejectedValue(new Error('Network error'));
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  it('does not save or search again when same word', async () => {
    mockedFetchVehicles.mockResolvedValue(mockVehicles);
    render(<App />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Toyota');
    const button = screen.getByRole('button', { name: /search/i });
    await userEvent.click(button);
    vi.clearAllMocks();
    await userEvent.click(button);
    expect(localStorage.setItem).not.toHaveBeenCalled();
    expect(mockedFetchVehicles).not.toHaveBeenCalled();
  });

  it('saves search term to localStorage after search', async () => {
    mockedFetchVehicles.mockResolvedValue(mockVehicles);
    render(<App />);

    const button = screen.getByRole('button', { name: /search/i });
    await waitFor(() => expect(button).not.toBeDisabled());

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Honda');
    await userEvent.click(button);

    expect(localStorage.getItem('carSearchTerm')).toBe('Honda');
    expect(mockedFetchVehicles).toHaveBeenCalledWith('Honda');
  });

  it('shows empty input when localStorage is empty', () => {
    mockedFetchVehicles.mockResolvedValue(mockVehicles);
    render(<App />);
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(mockedFetchVehicles).toHaveBeenCalledWith('');
  });
});