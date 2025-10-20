import { useState, useEffect, useCallback } from 'react';
import apiFetch from '../services/api.js';
import { tournamentsMock } from '../mocks/tournamentsMock.js';

const API_TOURNAMENTS_PATH = '/tournaments';

export const useTorneos = () => {
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTorneos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch(API_TOURNAMENTS_PATH);

      if (!response.ok) {
        throw new Error('No se pudo obtener la lista de torneos.');
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('La respuesta del servidor no tiene el formato esperado.');
      }

      setTorneos(data);
    } catch (err) {
      console.warn('Fallo al cargar torneos desde la API, usando datos mockeados.', err);
      setError(err.message);
      setTorneos(tournamentsMock);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTorneos();
  }, [fetchTorneos]);

  const createTorneo = async (torneoData) => {
    try {
      const newTournament = {
        id: Date.now(),
        phase: torneoData?.phase ?? 'Inscripciones',
        currentTeams: torneoData?.currentTeams ?? 0,
        matches: torneoData?.matches ?? [],
        ...torneoData,
      };

      setTorneos((prev) => [newTournament, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTorneo = async (id) => {
    try {
      setTorneos((prev) => prev.filter((torneo) => torneo.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const updateTorneo = async (updatedData) => {
    try {
      setTorneos((prev) =>
        prev.map((torneo) => (torneo.id === updatedData.id ? { ...torneo, ...updatedData } : torneo)),
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const registerResult = (tournamentId, matchId, scores) => {
    setTorneos((prev) =>
      prev.map((torneo) => {
        if (torneo.id !== tournamentId) return torneo;

        const updatedMatches = (torneo.matches ?? []).map((match) =>
          match.id === matchId ? { ...match, ...scores, status: 'played' } : match,
        );

        return { ...torneo, matches: updatedMatches };
      }),
    );
  };

  return { torneos, loading, error, createTorneo, deleteTorneo, updateTorneo, registerResult };
};

export default useTorneos;
