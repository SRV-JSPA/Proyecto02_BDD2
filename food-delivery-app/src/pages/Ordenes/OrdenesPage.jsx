import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaEye } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { getOrdenes } from '../../api/ordenes';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';

const OrdenesPage = () => {
  const { user } = useAuth();
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginacion, setPaginacion] = useState(null);

  useEffect(() => {
    const fetchOrdenes = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const params = {
          usuarioId: user._id,
          limite: 10,
          pagina: currentPage,
          ordenarPor: 'fecha'
        };

        if (filtro !== 'all') {
          params.estado = filtro;
        }

        const data = await getOrdenes(params);
        setOrdenes(data.ordenes || []);
        setPaginacion(data.paginacion || null);
      } catch (err) {
        setError('Error al cargar los pedidos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdenes();
  }, [user, filtro, currentPage]);

  const filteredOrdenes = searchTerm
    ? ordenes.filter(orden => 
        orden.restaurante?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orden._id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : ordenes;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const getEstadoClasses = (estado) => {
    switch (estado) {
      case 'pendiente':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          label: 'Pendiente'
        };
      case 'preparando':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          label: 'Preparando'
        };
      case 'entregado':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          label: 'Entregado'
        };
      case 'cancelado':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          label: 'Cancelado'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          label: estado
        };
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mis Pedidos</h1>

      <div className="mb-8 bg-white rounded-lg shadow-md p-4">
        <form onSubmit={handleSearch} className="flex mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar por restaurante..."
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
            Filtrar por:
          </div>
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
              filtro === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFiltro('all')}
          >
            Todos
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
              filtro === 'pendiente'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFiltro('pendiente')}
          >
            Pendientes
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
              filtro === 'preparando'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFiltro('preparando')}
          >
            Preparando
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
              filtro === 'entregado'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFiltro('entregado')}
          >
            Entregados
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
              filtro === 'cancelado'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFiltro('cancelado')}
          >
            Cancelados
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Loading size="large" />
        </div>
      ) : error ? (
        <ErrorMessage message={error} className="mb-4" />
      ) : filteredOrdenes.length === 0 ? (
        <Card padding="large" className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes pedidos</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? `No hay resultados para "${searchTerm}"`
              : filtro !== 'all'
              ? `No tienes pedidos con estado "${getEstadoClasses(filtro).label}"`
              : 'Aún no has realizado ningún pedido'}
          </p>
          <Link to="/restaurantes">
            <Button>Explorar restaurantes</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrdenes.map((orden) => {
            const estadoInfo = getEstadoClasses(orden.estado);
            
            return (
              <Card key={orden._id} className="hover:shadow-md transition-shadow">
                <div className="md:flex justify-between items-start">
                  {/* Información principal */}
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center mb-2">
                      <h3 className="font-semibold text-lg">
                        Pedido en {orden.restaurante?.nombre || 'Restaurante'}
                      </h3>
                      <span
                        className={`ml-3 ${estadoInfo.bg} ${estadoInfo.text} text-xs font-medium px-2.5 py-0.5 rounded-full`}
                      >
                        {estadoInfo.label}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">
                      ID: {orden._id}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Fecha: {formatDate(orden.fecha)}
                    </p>
                    <p className="font-medium mt-2">
                      Total: {orden.total?.toFixed(2)} €
                    </p>
                  </div>

                  <div className="mb-4 md:mb-0 md:mx-4 flex-grow">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Productos ({orden.items?.length || 0}):
                    </h4>
                    <ul className="text-sm text-gray-600">
                      {orden.items?.slice(0, 3).map((item, index) => (
                        <li key={index}>
                          {item.cantidad}x {item.articulo?.nombre || 'Producto'} 
                          {item.articulo?.precio && ` (${item.articulo.precio.toFixed(2)} €)`}
                        </li>
                      ))}
                      {orden.items?.length > 3 && (
                        <li className="text-primary-600">
                          + {orden.items.length - 3} productos más
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                    <Link to={`/ordenes/${orden._id}`}>
                      <Button
                        variant="outline"
                        size="small"
                        icon={<FaEye />}
                        className="w-full"
                      >
                        Ver detalles
                      </Button>
                    </Link>
                    {orden.estado === 'pendiente' && (
                      <Button
                        variant="danger"
                        size="small"
                        className="w-full"
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}

          {paginacion && paginacion.paginas > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
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

export default OrdenesPage;