export interface Vehicle {
  id: number;
  make_id: number;
  make: string;
  name: string; 
}

export interface ApiResponse {
  data: Vehicle[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  metadata: {
    extraction_time: string;
    cache_hit: boolean;
  };
}

export interface SearchProps {
  initialSearchTerm: string;
  onSearch: (term: string) => void;
  isLoading: boolean;
}

export interface ResultsProps {
  items: Vehicle[];
  error: string | null;
}           