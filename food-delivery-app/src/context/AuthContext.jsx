import { createContext, useState, useEffect } from 'react';
import { login as loginAPI, register as registerAPI, updateUsuario } from '../api/usuarios';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
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
      setIsAuthenticated(true);
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
      setIsAuthenticated(true);
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
    setIsAuthenticated(false);
    toast.info('Sesión cerrada');
  };

  const updateUserData = (newData) => {
    const updatedUser = { ...user, ...newData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user || !user._id) {
        throw new Error('No hay usuario autenticado');
      }
      
      const updatedUser = await updateUsuario(user._id, userData);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success('Perfil actualizado correctamente');
      return updatedUser;
    } catch (error) {
      const message = error.response?.data?.error || 'Error al actualizar el perfil';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    updateUserData,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};