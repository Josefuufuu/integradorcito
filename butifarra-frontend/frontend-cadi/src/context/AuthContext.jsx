import { createContext, useCallback, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { apiFetch } from "../services/api";

const AuthContext = createContext(null);

const parseResponse = async (response) => {
  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch (error) {
      data = null;
    }
  }

  return {
    data,
    ok: response.ok,
    status: response.status,
  };
};

const extractMessage = (data, status) => {
  if (data && typeof data === "object") {
    return (
      data.detail ||
      data.message ||
      data.error ||
      data.non_field_errors?.[0]
    );
  }

  if (status === 401 || status === 403) {
    return "Sesión no válida.";
  }

  return "Ocurrió un error inesperado.";
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUserData = useCallback((payload) => {
    if (!payload) {
      setUser(null);
      return null;
    }

    if (typeof payload === "object" && payload !== null) {
      const candidate = payload.user ?? payload;
      setUser(candidate);
      return candidate;
    }

    setUser(null);
    return null;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch("/api/login/", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const { data, ok, status } = await parseResponse(response);

      if (!ok) {
        throw new Error(extractMessage(data, status));
      }

      return handleUserData(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo iniciar sesión.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleUserData]);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch("/api/logout/", {
        method: "POST",
      });

      const { data, ok, status } = await parseResponse(response);

      if (!ok) {
        throw new Error(extractMessage(data, status));
      }

      setUser(null);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo cerrar la sesión.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const restoreSession = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch("/api/session/");
      const { data, ok, status } = await parseResponse(response);

      if (!ok) {
        if (status === 401 || status === 403) {
          setUser(null);
          return null;
        }

        throw new Error(extractMessage(data, status));
      }

      return handleUserData(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo restaurar la sesión.";
      setError(message);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleUserData]);

  const value = useMemo(() => ({
    user,
    loading,
    error,
    login,
    logout,
    restoreSession,
  }), [user, loading, error, login, logout, restoreSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth debe utilizarse dentro de un AuthProvider");
  }

  return context;
}
