import axios from './axios';

export const getRestaurantes = async (params = {}) => {
  try {
    const response = await axios.get('/restaurantes', { params });
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRestauranteById = async (id) => {
  try {
    const response = await axios.get(`/restaurantes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createRestaurante = async (data) => {
  try {
    const response = await axios.post('/restaurantes', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRestaurante = async (id, data) => {
  try {
    const response = await axios.put(`/restaurantes/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRestaurante = async (id) => {
  try {
    const response = await axios.delete(`/restaurantes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRestaurantesCercanos = async (coords) => {
  try {
    const { lng, lat, distancia } = coords;
    const response = await axios.get('/restaurantes/cercanos', { 
      params: { lng, lat, distancia } 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const buscarRestaurantes = async (query) => {
  try {
    const response = await axios.get('/restaurantes/buscar', { 
      params: { q: query } 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};