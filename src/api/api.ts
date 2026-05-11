import type { Vehicle } from '../types';

const BASE_URL = '/carapi'; 

export async function fetchVehicles(searchTerm: string): Promise<Vehicle[]> {
  const trimmed = searchTerm.trim();
  let url: string;

  if (trimmed) {
    url = `${BASE_URL}/api/models/v2?make=${encodeURIComponent(trimmed)}`;
  } else {
    url = `${BASE_URL}/api/models/v2?limit=20`;
  }

  const response = await fetch(url, {
    headers: { 'accept': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Error CarAPI: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return json.data;
}