// src/hooks/useTorneos.js
import { useState, useEffect, useCallback } from 'react';

const API_URL = '/api/torneos/'; 

export const useTorneos = () => {
  const [torneos, setTorneos] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTorneos = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    setTorneos(data);
  } catch (err) { setError(err.message); }
};

  useEffect(() => {
    fetchTorneos();
  }, [fetchTorneos]);

const createTorneo = async (torneoData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
    credentials: 'include',
    body: JSON.stringify(torneoData)
  });
  if (!response.ok) throw new Error('Error al crear torneo');
  const newTorneo = await response.json();
  setTorneos(prev => [newTorneo, ...prev]);
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