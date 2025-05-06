import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getRestaurantes, buscarRestaurantes } from '../../api/restaurantes';
import RestauranteList from '../../components/restaurantes/RestauranteList';
import RestauranteFilters from '../../components/restaurantes/RestauranteFilters';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const RestaurantesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginacion, setPaginacion] = useState(null);

  const q = searchParams.get('q') || '';
  const tipoCocina = searchParams.get('tipoCocina') || '';
  const ciudad = searchParams.get('ciudad') || '';
  const ordenarPor = searchParams.get('ordenarPor') || 'nombre';
  const pagina = parseInt(searchParams.get('pagina') || '1', 10);
  const limite = parseInt(searchParams.get('limite') || '12', 10);

  useEffect(() => {
    const fetchRestaurantes = async () => {
      try {
        setLoading(true);
        let data;

        if (q) {
          data = await buscarRestaurantes(q);
          setRestaurantes(data || []);
          setPaginacion({
            total: data.length,
            pagina: 1,
            paginas: 1
          });
        } else {
          const params = {
            tipoCocina,
            ciudad,
            ordenarPor,
            pagina,
            limite
          };
          
          Object.keys(params).forEach(key => {
            if (params[key] === '') {
              delete params[key];
            }
          });
          
          data = await getRestaurantes(params);
          setRestaurantes(data.restaurantes || []);
          setPaginacion(data.paginacion || null);
        }
      } catch (err) {
        setError('Error al cargar restaurantes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantes();
  }, [q, tipoCocina, ciudad, ordenarPor, pagina, limite]);

  const handleFilterChange = (filters) => {
    const newSearchParams = {};
    
    if (filters.q) newSearchParams.q = filters.q;
    if (filters.tipoCocina) newSearchParams.tipoCocina = filters.tipoCocina;
    if (filters.ciudad) newSearchParams.ciudad = filters.ciudad;
    if (filters.ordenarPor) newSearchParams.ordenarPor = filters.ordenarPor;
    
    newSearchParams.pagina = '1';
    newSearchParams.limite = limite.toString();
    
    setSearchParams(newSearchParams);
  };

  const handlePageChange = (newPage) => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      pagina: newPage.toString()
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {q 
          ? `Búsqueda: "${q}"` 
          : tipoCocina 
            ? `Restaurantes de comida ${tipoCocina}` 
            : 'Explora Restaurantes'}
      </h1>

      <RestauranteFilters
        onFilterChange={handleFilterChange}
        initialFilters={{ tipoCocina, ciudad, ordenarPor }}
      />

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
      ) : (
        <RestauranteList
          restaurantes={restaurantes}
          paginacion={paginacion}
          onPageChange={handlePageChange}
          emptyMessage={
            q 
              ? `No se encontraron restaurantes para "${q}"` 
              : 'No se encontraron restaurantes con los filtros seleccionados'
          }
        />
      )}
    </div>
  );
};

export default RestaurantesPage;