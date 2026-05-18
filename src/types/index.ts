export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      }
    }
  };
}

export interface SearchProps {
  initialSearchTerm: string;
  onSearch: (term: string) => void;
  isLoading: boolean;
}

export interface ResultsProps {
  items: Pokemon[];
  error: string | null;
}