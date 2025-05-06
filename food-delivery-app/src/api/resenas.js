import axios from './axios';

export const getResenas = async (params = {}) => {
  try {
    const response = await axios.get('/resenas', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getResenaById = async (id) => {
  try {
    const response = await axios.get(`/resenas/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createResena = async (data) => {
  try {
    const response = await axios.post('/resenas', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateResena = async (id, data) => {
  try {
    const response = await axios.put(`/resenas/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteResena = async (id) => {
  try {
    const response = await axios.delete(`/resenas/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const buscarResenas = async (query) => {
  try {
    const response = await axios.get('/resenas/buscar', { 
      params: { q: query } 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};