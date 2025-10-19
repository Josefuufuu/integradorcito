// src/hooks/useTorneos.js
import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../services/api';

const API_URL = '/api/torneos/';

export const useTorneos = () => {
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTorneos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiFetch(API_URL);
      if (!response.ok) {
        throw new Error('Error al obtener torneos');
      }
      const data = await response.json();
      setTorneos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTorneos();
  }, [fetchTorneos]);

  const createTorneo = useCallback(async (torneoData) => {
    const response = await apiFetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(torneoData),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      const detail = payload?.detail || payload?.error;
      throw new Error(detail || 'Error al crear torneo');
    }

    const newTorneo = await response.json();
    setTorneos((prev) => [newTorneo, ...prev]);
  }, []);

  const deleteTorneo = useCallback(async (id) => {
    const response = await apiFetch(`${API_URL}${id}/`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error al eliminar torneo');
    }

    setTorneos((prev) => prev.filter((torneo) => torneo.id !== id));
  }, []);

  const updateTorneo = useCallback(async (updatedData) => {
    const response = await apiFetch(`${API_URL}${updatedData.id}/`, {
      method: 'PATCH',
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar torneo');
    }

    const torneoActualizado = await response.json();
    setTorneos((prev) => prev.map((t) => (t.id === torneoActualizado.id ? torneoActualizado : t)));
  }, []);

  return { torneos, loading, error, createTorneo, deleteTorneo, updateTorneo, refetch: fetchTorneos };
};
