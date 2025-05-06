import React from 'react';
import RestauranteCard from './RestauranteCard';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import Pagination from '../common/Pagination';

const RestauranteList = ({
  restaurantes = [],
  loading = false,
  error = null,
  paginacion = null,
  onPageChange = null,
  emptyMessage = 'No se encontraron restaurantes'
}) => {
  const restaurantesArray = Array.isArray(restaurantes) ? restaurantes : [];
  
  if (loading) {
    return (
      <div className="min-h-[300px] flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-[200px] flex justify-center items-center">
        <ErrorMessage
          message={error}
          type="connection"
          className="w-full max-w-md"
        />
      </div>
    );
  }
  
  if (!restaurantesArray.length) {
    return (
      <div className="min-h-[200px] flex justify-center items-center text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurantesArray.map((restaurante) => (
          <RestauranteCard key={restaurante._id} restaurante={restaurante} />
        ))}
      </div>
      
      {paginacion && paginacion.paginas > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={paginacion.pagina}
            totalPages={paginacion.paginas}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default RestauranteList;