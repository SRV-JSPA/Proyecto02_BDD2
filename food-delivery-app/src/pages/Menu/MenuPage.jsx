import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMenuRestaurante } from '../../api/articulosMenu';
import { getRestauranteById } from '../../api/restaurantes';
import CategoriaMenu from '../../components/menu/CategoriaMenu';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Button from '../../components/common/Button';
import { FaArrowLeft, FaFilter, FaSearch } from 'react-icons/fa';

const MenuPage = () => {
  const { restauranteId } = useParams();
  const navigate = useNavigate();
  const [restaurante, setRestaurante] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [menuPorCategoria, setMenuPorCategoria] = useState({});
  const [especiales, setEspeciales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroActivo, setFiltroActivo] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const categoriasRefs = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const restauranteData = await getRestauranteById(restauranteId);
        setRestaurante(restauranteData);
        
        const menuData = await getMenuRestaurante(restauranteId);
        setCategorias(menuData.categorias || []);
        setMenuPorCategoria(menuData.menuPorCategoria || {});
        setEspeciales(menuData.especiales || []);
        
      } catch (err) {
        setError('Error al cargar el menú del restaurante');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (restauranteId) {
      fetchData();
    }
  }, [restauranteId]);

  const filtrarArticulos = (categoria, articulos) => {
    if (!articulos) return [];
    
    let articulosFiltrados = searchTerm
      ? articulos.filter(art => 
          art.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (art.descripcion && art.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
          art.ingredientes.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      : articulos;
    
    switch (filtroActivo) {
      case 'vegetarian':
        return articulosFiltrados.filter(art => 
          art.aptoPara && art.aptoPara.includes('Vegetariano')
        );
      case 'vegan':
        return articulosFiltrados.filter(art => 
          art.aptoPara && art.aptoPara.includes('Vegano')
        );
      case 'gluten-free':
        return articulosFiltrados.filter(art => 
          art.aptoPara && art.aptoPara.includes('Sin Gluten')
        );
      case 'specials':
        return articulosFiltrados.filter(art => art.especialDelDia);
      default:
        return articulosFiltrados;
    }
  };

  const handleFilterClick = (filtro) => {
    setFiltroActivo(filtro);
    setShowFilters(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const scrollToCategoria = (categoriaId) => {
    if (categoriasRefs.current[categoriaId]) {
      categoriasRefs.current[categoriaId].scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[500px] flex justify-center items-center">
        <Loading size="large" />
      </div>
    );
  }

  if (error || !restaurante) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage 
          message={error || 'Restaurante no encontrado'} 
          type={error ? 'connection' : 'notFound'} 
          className="max-w-xl mx-auto" 
        />
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/restaurantes')}
          >
            Volver a Restaurantes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => navigate(`/restaurantes/${restauranteId}`)}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-3xl font-bold">{restaurante.nombre}</h1>
        </div>
        <p className="text-gray-600">
          {restaurante.direccion?.ciudad && restaurante.direccion.ciudad}
        </p>
      </div>

      <div className="mb-8 bg-white rounded-lg shadow-md p-4">
        <form onSubmit={handleSearch} className="flex mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar en el menú..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
          </div>
        </form>

        <div className="md:hidden mb-4">
          <button
            className="flex items-center text-primary-600"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="mr-2" />
            {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
          </button>
        </div>

        {showFilters && (
          <div className="md:hidden space-y-2 mb-4">
            <button
              className={`block w-full text-left px-4 py-2 rounded-lg ${
                filtroActivo === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => handleFilterClick('all')}
            >
              Todos los platos
            </button>
            <button
              className={`block w-full text-left px-4 py-2 rounded-lg ${
                filtroActivo === 'vegetarian'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => handleFilterClick('vegetarian')}
            >
              Vegetarianos
            </button>
            <button
              className={`block w-full text-left px-4 py-2 rounded-lg ${
                filtroActivo === 'vegan'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => handleFilterClick('vegan')}
            >
              Veganos
            </button>
            <button
              className={`block w-full text-left px-4 py-2 rounded-lg ${
                filtroActivo === 'gluten-free'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => handleFilterClick('gluten-free')}
            >
              Sin Gluten
            </button>
            <button
              className={`block w-full text-left px-4 py-2 rounded-lg ${
                filtroActivo === 'specials'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => handleFilterClick('specials')}
            >
              Especiales del día
            </button>
          </div>
        )}

        <div className="hidden md:flex space-x-2">
          <button
            className={`px-4 py-2 rounded-lg ${
              filtroActivo === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFiltroActivo('all')}
          >
            Todos los platos
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filtroActivo === 'vegetarian'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFiltroActivo('vegetarian')}
          >
            Vegetarianos
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filtroActivo === 'vegan'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFiltroActivo('vegan')}
          >
            Veganos
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filtroActivo === 'gluten-free'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFiltroActivo('gluten-free')}
          >
            Sin Gluten
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filtroActivo === 'specials'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFiltroActivo('specials')}
          >
            Especiales del día
          </button>
        </div>
      </div>

      {categorias.length > 0 && (
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-4 p-2">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                className="px-4 py-2 whitespace-nowrap bg-white rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none"
                onClick={() => scrollToCategoria(categoria)}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>
      )}

      {(filtroActivo === 'all' || filtroActivo === 'specials') && especiales.length > 0 && (
        <div 
          ref={el => (categoriasRefs.current['Especiales'] = el)}
          className="mb-12"
        >
          <CategoriaMenu 
            titulo="Especiales del Día" 
            articulos={filtrarArticulos('Especiales', especiales)}
            restaurante={restaurante}
          />
        </div>
      )}

      {categorias.length > 0 ? (
        <div>
          {categorias.map((categoria) => {
            const articulosFiltrados = filtrarArticulos(
              categoria, 
              menuPorCategoria[categoria]
            );
            
            if (articulosFiltrados.length === 0) return null;
            
            return (
              <div 
                key={categoria}
                ref={el => (categoriasRefs.current[categoria] = el)}
              >
                <CategoriaMenu
                  titulo={categoria}
                  articulos={articulosFiltrados}
                  restaurante={restaurante}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            Este restaurante aún no ha publicado su menú.
          </p>
        </div>
      )}

      {categorias.length > 0 && 
       Object.keys(menuPorCategoria).every(cat => 
         filtrarArticulos(cat, menuPorCategoria[cat]).length === 0
       ) && 
       ((filtroActivo !== 'specials' && filtroActivo !== 'all') || 
        (filtroActivo === 'specials' && especiales.length === 0) ||
        (filtroActivo === 'all' && especiales.length === 0)) && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            No se encontraron platos que coincidan con los filtros seleccionados.
          </p>
          <button
            className="mt-4 text-primary-600 hover:text-primary-700"
            onClick={() => {
              setFiltroActivo('all');
              setSearchTerm('');
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuPage;