import { createContext, useState, useEffect } from 'react';
import { login as loginAPI, register as registerAPI } from '../api/usuarios';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await loginAPI(credentials);
      const { usuario, token } = response;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));
      
      setUser(usuario);
      toast.success('Inicio de sesión exitoso');
      return usuario;
    } catch (error) {
      const message = error.response?.data?.error || 'Error al iniciar sesión';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await registerAPI(userData);
      const { usuario, token } = response;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));
      
      setUser(usuario);
      toast.success('Registro exitoso');
      return usuario;
    } catch (error) {
      const message = error.response?.data?.error || 'Error al registrarse';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.info('Sesión cerrada');
  };

  const updateUserData = (newData) => {
    const updatedUser = { ...user, ...newData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};