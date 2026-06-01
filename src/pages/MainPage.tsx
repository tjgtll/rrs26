import React, { useState, useEffect } from 'react';
import { useSearchParams, Outlet, useNavigate } from 'react-router-dom';
import { Search } from '../components/Search';
import { Results } from '../components/Results';
import { Loader } from '../components/Loader';
import { Pagination } from '../components/Pagination';
import { Flyout } from '../components/Flyout';
import { usePokemonList, usePokemonSearch, useInvalidateCache } from '../hooks/usePokemonQueries';
import { useTheme } from '../hooks/useTheme';
import type { Pokemon } from '../types';

const ITEMS_PER_PAGE = 10;

export const MainPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { invalidatePokemonList, refetchPokemonList } = useInvalidateCache();

  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const searchParam = searchParams.get('search') || '';

  const [currentPage, setCurrentPage] = useState(pageParam);

  const {
    data: listData,
    isLoading: listLoading,
    error: listError,
    isFetching: listFetching,
  } = usePokemonList(currentPage, !searchParam);

  const {
    data: searchResult,
    isLoading: searchLoading,
    error: searchError,
  } = usePokemonSearch(searchParam);

  let pokemons: Pokemon[] = [];
  let totalCount = 0;
  let loading = false;
  let error = null;

  if (searchParam) {
    pokemons = searchResult 
      ? [{ name: searchResult.name, url: `https://pokeapi.co/api/v2/pokemon/${searchResult.id}/` }]
      : [];
    totalCount = searchResult ? 1 : 0;
    loading = searchLoading;
    error = searchError?.message || null;
  } else {
    pokemons = listData?.results || [];
    totalCount = listData?.count || 0;
    loading = listLoading;
    error = listError?.message || null;
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchParam) params.set('search', searchParam);
    params.set('page', currentPage.toString());
    setSearchParams(params, { replace: true });
  }, [currentPage, searchParam, setSearchParams]);

  const handlePokemonClick = (name: string) => {
    navigate(`/details/${name}?page=${currentPage}&search=${searchParam}`);
  };

  const handleSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) {
      navigate('/?page=1', { replace: true });
      return;
    }
    navigate(`/?search=${trimmed}&page=1`, { replace: true });
  };

  const handleRefresh = async () => {
    if (searchParam) {
      await invalidatePokemonList(currentPage);
    } else {
      await refetchPokemonList(currentPage);
    }
  };

  return (
    <div className="master-detail-layout">
      <div className="theme-toggle">
        <button onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'dark' : 'light'} mode
        </button>
        <button 
          onClick={handleRefresh} 
          className="refresh-button" 
          disabled={loading}
        >
          🔄 Refresh {listFetching && '(Updating...)'}
        </button>
      </div>
      <div className="left-panel">
        <Search
          key={searchParam}
          initialSearchTerm={searchParam}
          onSearch={handleSearch}
          isLoading={loading}
        />
        
        {loading && <Loader />}
        
        {error && (
          <div className="error-message">
            <p>Error {error}</p>
            <button onClick={handleRefresh}>Try Again</button>
          </div>
        )}
        
        {!loading && !error && (
          <>
            <Results 
              items={pokemons} 
              error={null} 
              onItemClick={handlePokemonClick} 
            />
            {!searchParam && totalPages > 1 && (
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
              />
            )}
          </>
        )}
      </div>
      <div className="right-panel">
        <Outlet />
        <Flyout items={pokemons} />
      </div>
    </div>
  );
};