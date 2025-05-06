import axios from './axios';

export const getOrdenes = async (params = {}) => {
  try {
    const response = await axios.get('/ordenes', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrdenById = async (id) => {
  try {
    const response = await axios.get(`/ordenes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createOrden = async (data) => {
  try {
    const response = await axios.post('/ordenes', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateOrden = async (id, data) => {
  try {
    const response = await axios.put(`/ordenes/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteOrden = async (id) => {
  try {
    const response = await axios.delete(`/ordenes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};