import React, { useState } from 'react';
import type { SearchProps } from '../types';

export const Search: React.FC<SearchProps> = ({ initialSearchTerm, onSearch, isLoading }) => {
  const [inputValue, setInputValue] = useState(initialSearchTerm || '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearchClick = () => {
    const trimmed = inputValue.trim();
    onSearch(trimmed);
  };

  return (
    <div className="search-form">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Pokemon name (e.g., pikachu)"
        className="search-input"
        disabled={isLoading}
      />
      <button onClick={handleSearchClick} disabled={isLoading} className="search-button">
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
};