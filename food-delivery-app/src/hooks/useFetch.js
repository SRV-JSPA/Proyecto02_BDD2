import { useState, useEffect, useCallback } from 'react';


export const useFetch = (fetchFunction, dependencies = [], executeImmediately = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(executeImmediately);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error en la petición');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    if (executeImmediately) {
      execute();
    }
  }, [...dependencies, execute]);

  return { data, loading, error, execute };
};