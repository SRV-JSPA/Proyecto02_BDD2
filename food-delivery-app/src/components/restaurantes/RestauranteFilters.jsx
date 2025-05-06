import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaSortAmountDown } from 'react-icons/fa';
import Button from '../common/Button';

const tiposCocinaComunes = [
  'Italiana',
  'mexicana',
  'Japonesa',
  'China',
  'Española',
  'India',
  'Vegetariana',
  'Vegana',
  'Mediterránea',
  'Americana'
];

const ciudadesComunes = [
  'Madrid',
  'Barcelona',
  'Valencia',
  'Sevilla',
  'Bilbao',
  'Zaragoza',
  'Málaga',
  'Alicante',
  'Granada',
  'Murcia'
];

const RestauranteFilters = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    tipoCocina: '',
    ciudad: '',
    ordenarPor: 'nombre',
    ...initialFilters
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      ...initialFilters
    }));
  }, [initialFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onFilterChange) {
      onFilterChange({
        ...filters,
        q: searchTerm
      });
    }
  };

  const handleApplyFilters = () => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      tipoCocina: '',
      ciudad: '',
      ordenarPor: 'nombre'
    };
    
    setFilters(clearedFilters);
    setSearchTerm('');
    
    if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-md p-4">
      <form onSubmit={handleSearch} className="flex mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar restaurantes..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
        </div>
        <Button 
          type="submit" 
          className="rounded-l-none"
        >
          Buscar
        </Button>
      </form>

      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          className="flex items-center text-primary-600 hover:text-primary-700"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter className="mr-2" />
          <span>{showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}</span>
        </button>

        {showFilters && (
          <button
            type="button"
            className="text-gray-600 hover:text-gray-800 text-sm"
            onClick={handleClearFilters}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="tipoCocina" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de cocina
            </label>
            <select
              id="tipoCocina"
              name="tipoCocina"
              value={filters.tipoCocina}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todos los tipos</option>
              {tiposCocinaComunes.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad
            </label>
            <select
              id="ciudad"
              name="ciudad"
              value={filters.ciudad}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todas las ciudades</option>
              {ciudadesComunes.map((ciudad) => (
                <option key={ciudad} value={ciudad}>
                  {ciudad}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="ordenarPor" className="block text-sm font-medium text-gray-700 mb-1">
              Ordenar por
            </label>
            <div className="relative">
              <select
                id="ordenarPor"
                name="ordenarPor"
                value={filters.ordenarPor}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
              >
                <option value="nombre">Nombre (A-Z)</option>
                <option value="calificacion">Mejor calificación</option>
                <option value="precio">Precio (menor a mayor)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FaSortAmountDown className="text-gray-400" />
              </div>
            </div>
          </div>

          <div className="md:col-span-3 mt-2">
            <Button
              onClick={handleApplyFilters}
              className="w-full"
            >
              Aplicar filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestauranteFilters;