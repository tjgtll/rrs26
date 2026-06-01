import React from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader } from '../components/Loader';
import {
  usePokemonDetails,
  useInvalidateCache,
} from '../hooks/usePokemonQueries';

export const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refetchPokemonDetails } = useInvalidateCache();

  const {
    data: details,
    isLoading,
    error,
    isFetching,
  } = usePokemonDetails(id || '');

  const closeDetails = () => {
    const page = searchParams.get('page') || '1';
    const search = searchParams.get('search') || '';
    navigate(`/?page=${page}${search ? `&search=${search}` : ''}`);
  };

  const handleRefresh = async () => {
    if (id) {
      await refetchPokemonDetails(id);
    }
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="details-panel">
        <button className="close-details" onClick={closeDetails}>
          ✕
        </button>
        <div className="error-message">
          <p>❌ Failed to load details: {error.message}</p>
          <button onClick={handleRefresh}>Refresh</button>
        </div>
      </div>
    );
  }

  if (!details) return null;

  return (
    <div className="details-panel">
      <button className="close-details" onClick={closeDetails}>
        ✕
      </button>
      {isFetching && <div className="refreshing-indicator">Refreshing...</div>}
      <button onClick={handleRefresh} className="refresh-details">
        🔄 Refresh
      </button>
      <h2>{details.name.toUpperCase()}</h2>
      <img
        className="details-image"
        src={details.sprites?.other?.['official-artwork']?.front_default}
        alt={details.name}
      />
      <p>
        <strong>Height:</strong> {details.height / 10} m
      </p>
      <p>
        <strong>Weight:</strong> {details.weight / 10} kg
      </p>
      <p>
        <strong>ID:</strong> {details.id}
      </p>
    </div>
  );
};
