import React, { useState, useEffect } from 'react';
import { useSearchParams, Outlet, useNavigate } from 'react-router-dom';
import { Search } from '../components/Search';
import { Results } from '../components/Results';
import { Loader } from '../components/Loader';
import { Pagination } from '../components/Pagination';
import { fetchPokemonList, fetchPokemonDetails } from '../api/api';
import type { Pokemon } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage'; // adjust the import path

const ITEMS_PER_PAGE = 10; 

export const MainPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [storedSearch, setStoredSearch] = useLocalStorage('pokemonSearch', '');
  const [storedPage, setStoredPage] = useLocalStorage('pokemonPage', 1);

  const pageParam = parseInt(searchParams.get('page') || '', 10);
  const searchParam = searchParams.get('search') || '';

  const initialSearch = searchParam || storedSearch;
  const initialPage = !isNaN(pageParam) && pageParam > 0 ? pageParam : storedPage;

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const [currentSearch, setCurrentSearch] = useState(initialSearch);

  useEffect(() => {
    if (currentSearch) setStoredSearch(currentSearch);
    else setStoredSearch('');
  }, [currentSearch, setStoredSearch]);

  useEffect(() => {
    setStoredPage(currentPage);
  }, [currentPage, setStoredPage]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (currentSearch) params.set('search', currentSearch);
    params.set('page', currentPage.toString());
    setSearchParams(params, { replace: true });
  }, [currentPage, currentSearch, setSearchParams]);

  useEffect(() => {
    const loadList = async () => {
      setLoading(true);
      setError(null);
      try {
        const { results, count } = await fetchPokemonList(currentPage);
        setPokemons(results);
        setTotalCount(count);
      } catch {
        setError('Failed to load Pokémon list');
      } finally {
        setLoading(false);
      }
    };
    if (!currentSearch) {
      loadList();
    }
  }, [currentPage, currentSearch]);

  useEffect(() => {
    const loadSearchResult = async () => {
      if (!currentSearch) return;
      setLoading(true);
      setError(null);
      try {
        const details = await fetchPokemonDetails(currentSearch.toLowerCase());
        const foundPokemon: Pokemon = {
          name: details.name,
          url: `https://pokeapi.co/api/v2/pokemon/${details.id}/`,
        };
        setPokemons([foundPokemon]);
        setTotalCount(1);
        setCurrentPage(1);
      } catch {
        setError(`Pokémon "${currentSearch}" not found`);
        setPokemons([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };
    loadSearchResult();
  }, [currentSearch]);

  const handlePokemonClick = (name: string) => {
    navigate(`/details/${name}?page=${currentPage}&search=${currentSearch}`);
  };

  const handleSearch = async (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) {
      setCurrentSearch('');
      setCurrentPage(1);
      navigate('/?page=1', { replace: true });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await fetchPokemonDetails(trimmed.toLowerCase());
      setCurrentSearch(trimmed);
      setCurrentPage(1);
      navigate(`/details/${trimmed.toLowerCase()}?page=1&search=${trimmed}`, { replace: true });
    } catch {
      setError(`Pokémon "${trimmed}" not found`);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="master-detail-layout">
      <div className="left-panel">
        <Search
          key={currentSearch}
          initialSearchTerm={currentSearch}
          onSearch={handleSearch}
          isLoading={loading}
        />
        {loading && <Loader />}
        {error && <div className="error-message">{error}</div>}
        {!loading && !error && (
          <>
            <Results items={pokemons} error={null} onItemClick={handlePokemonClick} />
            {!currentSearch && totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            )}
          </>
        )}
      </div>
      <div className="right-panel">
        <Outlet />
      </div>
    </div>
  );
};