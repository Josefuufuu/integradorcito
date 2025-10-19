// src/hooks/useTorneos.js
import { useState, useEffect, useCallback } from 'react';

const API_URL = 'https://tu-api-de-ejemplo.com/api/v1/tournaments'; 

export const useTorneos = () => {
  const [torneos, setTorneos] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTorneos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {

      setTimeout(() => setLoading(false), 500);


    } catch (err) {
      setError(err.message);
    } finally {

    }
  }, []);

  useEffect(() => {
    fetchTorneos();
  }, [fetchTorneos]);

  const createTorneo = async (torneoData) => {
    console.log("Enviando datos para crear torneo al backend:", torneoData);

    const newTournament = { ...torneoData, id: Date.now(), phase: 'Inscripciones', currentTeams: 0 };
    setTorneos(prev => [newTournament, ...prev]);
  };

  const deleteTorneo = async (id) => {
    console.log("Enviando solicitud para eliminar torneo con ID:", id);

    setTorneos(prev => prev.filter(torneo => torneo.id !== id));
  };

  const updateTorneo = async (updatedData) => {
    console.log("Enviando datos para actualizar torneo:", updatedData);

    setTorneos(prev => prev.map(t => t.id === updatedData.id ? updatedData : t));
  };

  return { torneos, loading, error, createTorneo, deleteTorneo, updateTorneo };
};