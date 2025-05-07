import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaClipboardList, FaStar, FaUser, FaStore, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { getRestaurantes } from '../api/restaurantes';
import { getOrdenes } from '../api/ordenes';
import { getResenas } from '../api/resenas';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    restaurantes: [],
    ordenes: [],
    resenas: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [restaurantesRes, ordenesRes, resenasRes] = await Promise.all([
          getRestaurantes({ limite: 5 }),
          getOrdenes({ usuarioId: user._id, limite: 5 }),
          getResenas({ usuarioId: user._id, limite: 5 })
        ]);
        
        setStats({
          restaurantes: restaurantesRes.restaurantes || [],
          ordenes: ordenesRes.ordenes || [],
          resenas: resenasRes.resenas || []
        });
      } catch (err) {
        setError('Error al cargar los datos del dashboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loading size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} className="mb-6" />
      </div>
    );
  }

  const getEstadoClasses = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparando':
        return 'bg-blue-100 text-blue-800';
      case 'entregado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Panel de Control</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-primary-50 border-l-4 border-primary-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-500 text-white mr-4">
              <FaStore className="text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Restaurantes</h3>
              <p className="text-gray-600">Explora restaurantes cercanos</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/restaurantes">
              <Button variant="outline" fullWidth>Ver restaurantes</Button>
            </Link>
          </div>
        </Card>

        <Card className="bg-secondary-50 border-l-4 border-secondary-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-500 text-white mr-4">
              <FaShoppingCart className="text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Mis Pedidos</h3>
              <p className="text-gray-600">{stats.ordenes.length} pedidos recientes</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/ordenes">
              <Button variant="outline" fullWidth>Ver pedidos</Button>
            </Link>
          </div>
        </Card>

        <Card className="bg-green-50 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500 text-white mr-4">
              <FaStar className="text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Mis Reseñas</h3>
              <p className="text-gray-600">{stats.resenas.length} reseñas publicadas</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/resenas">
              <Button variant="outline" fullWidth>Ver reseñas</Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Últimos Pedidos</h2>
          {stats.ordenes.length === 0 ? (
            <Card className="text-center py-6">
              <p className="text-gray-500 mb-4">No tienes pedidos recientes</p>
              <Link to="/restaurantes">
                <Button>Explorar restaurantes</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {stats.ordenes.map(orden => (
                <Card key={orden._id} className="hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{orden.restaurante?.nombre || 'Restaurante'}</h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(orden.fecha)} - {orden.items?.length || 0} items
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getEstadoClasses(orden.estado)}`}>
                        {orden.estado}
                      </span>
                      <Link to={`/ordenes/${orden._id}`}>
                        <Button variant="outline" size="small">
                          Detalles
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
              <div className="text-center mt-4">
                <Link to="/ordenes">
                  <Button variant="outline">Ver todos los pedidos</Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Mis Reseñas Recientes</h2>
          {stats.resenas.length === 0 ? (
            <Card className="text-center py-6">
              <p className="text-gray-500 mb-4">No has publicado reseñas aún</p>
              <Link to="/restaurantes">
                <Button>Explorar restaurantes</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {stats.resenas.map(resena => (
                <Card key={resena._id} className="hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{resena.restaurante?.nombre || 'Restaurante'}</h3>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < resena.calificacion ? 'text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                        <span className="ml-2 text-gray-600">{formatDate(resena.fecha)}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                        {resena.comentario}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
              <div className="text-center mt-4">
                <Link to="/resenas">
                  <Button variant="outline">Ver todas mis reseñas</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Restaurantes Populares</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.restaurantes.slice(0, 3).map(restaurante => (
            <Card key={restaurante._id} className="hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden mr-4">
                  <img
                    src={restaurante.imagenes?.[0] || '../public/assets/images/default-restaurant.png'}
                    alt={restaurante.nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '../public/assets/images/default-restaurant.png';
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-medium">{restaurante.nombre}</h3>
                  <p className="text-sm text-gray-600">
                    {restaurante.tiposCocina?.slice(0, 2).join(', ')}
                    {restaurante.tiposCocina?.length > 2 ? '...' : ''}
                  </p>
                  <div className="flex items-center text-sm">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{restaurante.calificacionPromedio?.toFixed(1) || '0.0'}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <Link to={`/restaurantes/${restaurante._id}`}>
                  <Button variant="outline" size="small" fullWidth>
                    Ver restaurante
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link to="/restaurantes">
            <Button>Ver todos los restaurantes</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;