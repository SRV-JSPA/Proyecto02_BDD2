const API_BASE_URL = '/api';

export const formatApiErrors = (error) => {
  if (!error) return 'Error desconocido';
  
  if (error.response && error.response.data) {
    const { data } = error.response;
    
    if (Array.isArray(data.error)) {
      return data.error.join(', ');
    }
    
    if (typeof data.error === 'string') {
      return data.error;
    }
    
    if (data.message) {
      return data.message;
    }
  }
  
  if (error.message) {
    if (error.message.includes('Network Error')) {
      return 'Error de conexión. Verifica tu conexión a internet.';
    }
    return error.message;
  }
  
  return 'Error en la comunicación con el servidor';
};

export const formatRequestData = (data) => {
  const formatted = { ...data };
  
  Object.keys(formatted).forEach(key => {
    if (typeof formatted[key] === 'string' && 
        (key === 'tiposCocina' || key === 'ingredientes' || key === 'alergenos' || key === 'aptoPara')) {
      formatted[key] = formatted[key].split(',').map(item => item.trim()).filter(Boolean);
    }
  });
  
  if (formatted.precio) {
    formatted.precio = parseFloat(formatted.precio);
  }
  
  if (formatted.precioPromedio) {
    formatted.precioPromedio = parseFloat(formatted.precioPromedio);
  }
  
  return formatted;
};

export const processApiResponse = (response) => {
  if (response.paginacion) {
    return {
      data: response.data || response.items || response.results || [],
      paginacion: response.paginacion
    };
  }
  
  return response;
};