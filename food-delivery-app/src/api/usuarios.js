import axios from './axios';

export const getUsuarios = async (params = {}) => {
  try {
    const response = await axios.get('/usuarios', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUsuarioById = async (id) => {
  try {
    const response = await axios.get(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUsuario = async (data) => {
  try {
    const response = await axios.post('/usuarios', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUsuario = async (id, data) => {
  try {
    const response = await axios.put(`/usuarios/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUsuario = async (id) => {
  try {
    const response = await axios.delete(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Direcciones
export const agregarDireccion = async (userId, direccion) => {
  try {
    const response = await axios.post(`/usuarios/${userId}/direcciones`, direccion);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const actualizarDireccion = async (userId, direccionId, data) => {
  try {
    const response = await axios.put(`/usuarios/${userId}/direcciones/${direccionId}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const eliminarDireccion = async (userId, direccionId) => {
  try {
    const response = await axios.delete(`/usuarios/${userId}/direcciones/${direccionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Métodos de pago
export const agregarMetodoPago = async (userId, metodoPago) => {
  try {
    const response = await axios.post(`/usuarios/${userId}/metodos-pago`, metodoPago);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const eliminarMetodoPago = async (userId, metodoPagoId) => {
  try {
    const response = await axios.delete(`/usuarios/${userId}/metodos-pago/${metodoPagoId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Restaurantes favoritos
export const agregarRestauranteFavorito = async (userId, restauranteId) => {
  try {
    const response = await axios.post(`/usuarios/${userId}/favoritos`, { restauranteId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const eliminarRestauranteFavorito = async (userId, restauranteId) => {
  try {
    const response = await axios.delete(`/usuarios/${userId}/favoritos/${restauranteId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUsuariosCercanos = async (coords) => {
  try {
    const { lng, lat, distancia } = coords;
    const response = await axios.get('/usuarios/cercanos', { 
      params: { lng, lat, distancia } 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const buscarUsuarios = async (query) => {
  try {
    const response = await axios.get('/usuarios/buscar', { 
      params: { q: query } 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};