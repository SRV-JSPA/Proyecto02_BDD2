import axios from './axios';

export const getArticulosMenu = async (params = {}) => {
  try {
    const response = await axios.get('/articulos-menu', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getArticuloMenuById = async (id) => {
  try {
    const response = await axios.get(`/articulos-menu/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createArticuloMenu = async (data) => {
  try {
    const response = await axios.post('/articulos-menu', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateArticuloMenu = async (id, data) => {
  try {
    const response = await axios.put(`/articulos-menu/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteArticuloMenu = async (id) => {
  try {
    const response = await axios.delete(`/articulos-menu/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMenuRestaurante = async (restauranteId, params = {}) => {
  try {
    const response = await axios.get(`/articulos-menu/restaurante/${restauranteId}`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cambiarDisponibilidad = async (id, disponible) => {
  try {
    const response = await axios.patch(`/articulos-menu/${id}/disponibilidad`, { disponible });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const toggleEspecialDelDia = async (id) => {
  try {
    const response = await axios.patch(`/articulos-menu/${id}/especial`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const buscarArticulos = async (query) => {
  try {
    const response = await axios.get('/articulos-menu/buscar', { 
      params: { q: query } 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getArticulosPorIngrediente = async (ingrediente) => {
  try {
    const response = await axios.get(`/articulos-menu/ingrediente/${ingrediente}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getArticulosPorDieta = async (dieta) => {
  try {
    const response = await axios.get(`/articulos-menu/dieta/${dieta}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};