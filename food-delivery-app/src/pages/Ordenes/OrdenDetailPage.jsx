import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaStore, FaCalendarAlt, FaCheck, FaSpinner, FaTimes } from 'react-icons/fa';
import { getOrdenById, updateOrden } from '../../api/ordenes';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { toast } from 'react-toastify';

const OrdenDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orden, setOrden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrden = async () => {
      try {
        setLoading(true);
        const data = await getOrdenById(id);
        setOrden(data);
      } catch (err) {
        setError('Error al cargar los detalles del pedido');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrden();
    }
  }, [id]);

  const handleCancelOrder = async () => {
    if (!orden || orden.estado !== 'pendiente') return;

    if (window.confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
      try {
        setCancelLoading(true);
        await updateOrden(orden._id, { estado: 'cancelado' });
        toast.success('Pedido cancelado correctamente');
        setOrden({ ...orden, estado: 'cancelado' });
      } catch (err) {
        toast.error('Error al cancelar el pedido');
        console.error(err);
      } finally {
        setCancelLoading(false);
      }
    }
  };

  const getEstadoInfo = (estado) => {
    switch (estado) {
      case 'pendiente':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: <FaSpinner className="animate-spin" />,
          label: 'Pendiente'
        };
      case 'preparando':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: <FaSpinner className="animate-spin" />,
          label: 'Preparando'
        };
      case 'entregado':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: <FaCheck />,
          label: 'Entregado'
        };
      case 'cancelado':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: <FaTimes />,
          label: 'Cancelado'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: null,
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loading size="large" />
      </div>
    );
  }

  if (error || !orden) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage 
          message={error || 'Pedido no encontrado'} 
          type={error ? 'connection' : 'notFound'} 
          className="mb-6" 
        />
        <div className="text-center">
          <Button variant="outline" onClick={() => navigate('/ordenes')}>
            Volver a mis pedidos
          </Button>
        </div>
      </div>
    );
  }

  const estadoInfo = getEstadoInfo(orden.estado);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate('/ordenes')}
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <h1 className="text-3xl font-bold">Detalles del Pedido</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold">Información del Pedido</h2>
                <p className="text-gray-500">ID: {orden._id}</p>
              </div>
              <div className={`${estadoInfo.bg} ${estadoInfo.text} px-3 py-1 rounded-full flex items-center`}>
                <span className="mr-1">{estadoInfo.icon}</span>
                {estadoInfo.label}
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="mr-3 text-gray-400">
                  <FaStore className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Restaurante</p>
                  <p className="font-medium">
                    {orden.restaurante?.nombre || 'Restaurante no disponible'}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="mr-3 text-gray-400">
                  <FaCalendarAlt className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha del pedido</p>
                  <p className="font-medium">{formatDate(orden.fecha)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="mr-3 text-gray-400">
                  <FaMapMarkerAlt className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dirección de entrega</p>
                  <p className="font-medium">
                    {user?.direcciones?.find(dir => dir.predeterminada)?.calle || 'Dirección no disponible'}
                  </p>
                </div>
              </div>
            </div>

            {orden.estado === 'pendiente' && (
              <div className="mt-4 flex justify-end">
                <Button
                  variant="danger"
                  onClick={handleCancelOrder}
                  loading={cancelLoading}
                  disabled={cancelLoading}
                >
                  Cancelar pedido
                </Button>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-6">Productos</h2>

            {orden.items && orden.items.length > 0 ? (
              <div className="space-y-4 mb-6">
                {orden.items.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center py-3 border-b last:border-b-0"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden mr-4">
                      <img
                        src={item.articulo?.imagen || '/assets/images/default-food.jpg'}
                        alt={item.articulo?.nombre || 'Producto'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/images/default-food.jpg';
                        }}
                      />
                    </div>

                    <div className="flex-grow">
                      <h3 className="font-medium">{item.articulo?.nombre || 'Producto'}</h3>
                      <p className="text-sm text-gray-500">
                        Cantidad: {item.cantidad}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">
                        {item.articulo?.precio?.toFixed(2) || '0.00'} €
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        Subtotal: {((item.articulo?.precio || 0) * item.cantidad).toFixed(2)} €
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No hay productos disponibles</p>
            )}

            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span>
                  {orden.items
                    ? orden.items.reduce(
                        (sum, item) => sum + (item.articulo?.precio || 0) * item.cantidad,
                        0
                      ).toFixed(2)
                    : '0.00'} €
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Gastos de envío</span>
                <span>2.99 €</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t">
                <span>Total</span>
                <span>{orden.total?.toFixed(2) || '0.00'} €</span>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="mb-8">
            <h2 className="text-xl font-semibold mb-6">Estado del Pedido</h2>
            
            <div className="relative">
              <div className="absolute left-4 top-1 bottom-1 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-8 relative">
                <div className="flex">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center 
                    ${['pendiente', 'preparando', 'entregado'].includes(orden.estado) 
                      ? 'bg-green-500 text-white' 
                      : orden.estado === 'cancelado' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-200'
                    } z-10 mr-4
                  `}>
                    <FaCheck className="text-sm" />
                  </div>
                  <div>
                    <h3 className="font-medium">Pedido recibido</h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(orden.fecha)}
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center 
                    ${['preparando', 'entregado'].includes(orden.estado) 
                      ? 'bg-green-500 text-white' 
                      : orden.estado === 'cancelado' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-200'
                    } z-10 mr-4
                  `}>
                    {orden.estado === 'cancelado' 
                      ? <FaTimes className="text-sm" /> 
                      : ['preparando', 'entregado'].includes(orden.estado) 
                        ? <FaCheck className="text-sm" /> 
                        : <FaSpinner className="text-sm" />
                    }
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {orden.estado === 'cancelado' 
                        ? 'Pedido cancelado' 
                        : 'Preparando pedido'
                      }
                    </h3>
                    <p className="text-sm text-gray-500">
                      {orden.estado === 'cancelado' 
                        ? 'Tu pedido ha sido cancelado' 
                        : ['preparando', 'entregado'].includes(orden.estado) 
                          ? 'El restaurante está preparando tu pedido' 
                          : 'Pendiente'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center 
                    ${orden.estado === 'entregado' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200'
                    } z-10 mr-4
                  `}>
                    {orden.estado === 'entregado' 
                      ? <FaCheck className="text-sm" /> 
                      : <FaSpinner className="text-sm" />
                    }
                  </div>
                  <div>
                    <h3 className="font-medium">Pedido entregado</h3>
                    <p className="text-sm text-gray-500">
                      {orden.estado === 'entregado' 
                        ? 'Tu pedido ha sido entregado' 
                        : 'Pendiente'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-6">Acciones</h2>
            
            <div className="space-y-3">
              <Link to={`/restaurantes/${orden.restaurante?._id || ''}`}>
                <Button
                  variant="outline"
                  fullWidth
                  className="justify-start"
                >
                  Ver restaurante
                </Button>
              </Link>
              
              {orden.estado === 'entregado' && (
                <Link to={`/resenas/nuevo/${orden.restaurante?._id || ''}`}>
                  <Button
                    variant="outline"
                    fullWidth
                    className="justify-start"
                  >
                    Dejar reseña
                  </Button>
                </Link>
              )}
              
              <Button
                variant="outline"
                fullWidth
                className="justify-start"
                onClick={() => navigate('/ordenes')}
              >
                Volver a mis pedidos
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrdenDetailPage;