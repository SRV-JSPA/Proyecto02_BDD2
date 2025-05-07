import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { toast } from 'react-toastify';

export const useFetch = (fetchFunction, dependencies = [], executeImmediately = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(executeImmediately);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user, logout } = useAuth();

  const refresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Error en la petición';
      setError(errorMessage);
      
      if (err.response?.status === 401) {
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        logout();
      } else if (err.response?.status === 403) {
        toast.error('No tienes permisos para realizar esta acción.');
      } else if (err.response?.status === 404) {
        toast.error('El recurso solicitado no existe.');
      } else if (err.response?.status >= 500) {
        toast.error('Error en el servidor. Inténtalo más tarde.');
      } else {
        toast.error(errorMessage);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, logout]);

  useEffect(() => {
    if (executeImmediately) {
      execute();
    }
  }, [...dependencies, refreshKey, execute]);

  return { data, loading, error, execute, refresh };
};