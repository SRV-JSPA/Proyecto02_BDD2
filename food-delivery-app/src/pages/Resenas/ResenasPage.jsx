import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaFilter, FaSearch } from 'react-icons/fa';
import { getResenas } from '../../api/resenas';
import { useAuth } from '../../hooks/useAuth';
import ResenaCard from '../../components/resenas/ResenaCard';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';

const ResenasPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginacion, setPaginacion] = useState(null);
  const { user } = useAuth();

  const restauranteId = searchParams.get('restauranteId') || '';
  const usuarioId = searchParams.get('usuarioId') || '';
  const ordenarPor = searchParams.get('ordenarPor') || 'fecha';
  const pagina = parseInt(searchParams.get('pagina') || '1', 10);
  const limite = parseInt(searchParams.get('limite') || '10', 10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchResenas = async () => {
      try {
        setLoading(true);
        const params = {
          restauranteId,
          usuarioId,
          ordenarPor,
          pagina,
          limite
        };
        
        Object.keys(params).forEach(key => {
          if (params[key] === '') {
            delete params[key];
          }
        });
        
        const data = await getResenas(params);
        setResenas(data.resenas || []);
        setPaginacion(data.paginacion || null);
      } catch (err) {
        setError('Error al cargar reseñas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResenas();
  }, [restauranteId, usuarioId, ordenarPor, pagina, limite]);

  const handleFilterChange = (filterType, value) => {
    const newSearchParams = { ...Object.fromEntries(searchParams) };
    
    if (value) {
      newSearchParams[filterType] = value;
    } else {
      delete newSearchParams[filterType];
    }
    
    newSearchParams.pagina = '1';
    
    setSearchParams(newSearchParams);
  };

  const handlePageChange = (newPage) => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      pagina: newPage.toString()
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
  };

  const filteredResenas = searchTerm
    ? resenas.filter(resena => 
        resena.comentario?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : resenas;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {restauranteId 
          ? 'Reseñas del restaurante' 
          : usuarioId === user?._id 
            ? 'Mis reseñas' 
            : 'Reseñas'}
      </h1>

      <div className="mb-8 bg-white rounded-lg shadow-md p-4">
        <form onSubmit={handleSearch} className="flex mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar en las reseñas..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
          </div>
        </form>

        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <div className="text-sm font-medium text-gray-700 whitespace-nowrap">
            <FaFilter className="inline-block mr-1" />
            Ordenar por:
          </div>
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
              ordenarPor === 'fecha'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleFilterChange('ordenarPor', 'fecha')}
          >
            Más recientes
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
              ordenarPor === 'calificacion'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleFilterChange('ordenarPor', 'calificacion')}
          >
            Mejor calificadas
          </button>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[300px] flex justify-center items-center">
          <Loading size="large" />
        </div>
      ) : error ? (
        <ErrorMessage 
          message={error} 
          type="connection" 
          className="max-w-xl mx-auto" 
        />
      ) : filteredResenas.length === 0 ? (
        <Card padding="large" className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reseñas disponibles</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? `No hay resultados para "${searchTerm}"`
              : 'Aún no hay reseñas para mostrar'}
          </p>
          {user && restauranteId && (
            <Button onClick={() => navigate(`/resenas/nuevo/${restauranteId}`)}>
              Escribir una reseña
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredResenas.map(resena => (
            <ResenaCard 
              key={resena._id} 
              resena={resena}
              showRestaurante={!restauranteId}
              showUser={!usuarioId}
              canEdit={user && resena.usuario?._id === user._id}
              onDelete={() => {}}
            />
          ))}
          
          {paginacion && paginacion.paginas > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={paginacion.pagina}
                totalPages={paginacion.paginas}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResenasPage;