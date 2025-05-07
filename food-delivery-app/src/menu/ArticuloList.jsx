import React from 'react';
import { Link } from 'react-router-dom';
import { FaFilter, FaSearch } from 'react-icons/fa';
import ArticuloCard from './ArticuloCard';
import Card from '../common/Card';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import Pagination from '../common/Pagination';

const ArticulosList = ({
  articulos = [],
  restaurante,
  loading = false,
  error = null,
  paginacion = null,
  onPageChange = null,
  onFilterChange = null,
  emptyMessage = 'No se encontraron artículos'
}) => {
  const articulosArray = Array.isArray(articulos) ? articulos : [];
  
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
  
  if (!articulosArray.length) {
    return (
      <div className="min-h-[200px] flex justify-center items-center">
        <Card padding="large" className="w-full max-w-md text-center">
          <p className="text-gray-500">{emptyMessage}</p>
          {restaurante && (
            <div className="mt-4">
              <Link to={`/menu/${restaurante._id}`}>
                <button className="text-primary-600 hover:text-primary-700">
                  Ver menú completo
                </button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articulosArray.map((articulo) => (
          <ArticuloCard key={articulo._id} articulo={articulo} restaurante={restaurante} />
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

export default ArticulosList;