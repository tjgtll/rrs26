import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader } from '../components/Loader';
import { fetchPokemonDetails } from '../api/api';
import type { PokemonDetails } from '../types';

export const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [details, setDetails] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const loadDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPokemonDetails(id);
        setDetails(data);
      } catch {
        setError('Failed to load details');
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [id]);

  const closeDetails = () => {
    const page = searchParams.get('page') || '1';
    navigate(`/?page=${page}`);
  };

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;
  if (!details) return null;

  return (
    <div className="details-panel">
      <button className="close-details" onClick={closeDetails}>✕</button>
      <h2>{details.name.toUpperCase()}</h2>
      <img 
        className="details-image"
        src={details.sprites?.other?.['official-artwork']?.front_default} 
        alt={details.name}
      />
      <p><strong>Height:</strong> {details.height / 10} m</p>
      <p><strong>Weight:</strong> {details.weight / 10} kg</p>
      <p><strong>ID:</strong> {details.id}</p>
    </div>
  );
};