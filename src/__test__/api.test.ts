import { describe, it, expect, beforeEach } from 'vitest';
import { fetchVehicles } from '../api/api';
import { vi } from 'vitest';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('fetchVehicles', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('calls API with search word', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ data: [] }) });
    await fetchVehicles('Toyota');
    expect(mockFetch).toHaveBeenCalledWith('/carapi/api/models/v2?make=Toyota', expect.any(Object));
  });

  it('calls API without search word (limit 20)', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ data: [] }) });
    await fetchVehicles('');
    expect(mockFetch).toHaveBeenCalledWith('/carapi/api/models/v2?limit=20', expect.any(Object));
  });

  it('returns car data', async () => {
    const mockData = { data: [{ id: 1, make: 'Toyota', name: 'Camry' }] };
    mockFetch.mockResolvedValue({ ok: true, json: async () => mockData });
    const result = await fetchVehicles('Toyota');
    expect(result).toEqual(mockData.data);
  });

  it('shows error when API fails', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500, statusText: 'Server Error' });
    await expect(fetchVehicles('Toyota')).rejects.toThrow('Error CarAPI: 500 Server Error');
  });
});