import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaCreditCard, FaMapMarkerAlt } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { createOrden } from '../../api/ordenes';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, restaurante, updateQuantity, removeFromCart, clearCart, getTotal } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState('');
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ordenExitosa, setOrdenExitosa] = useState(false);

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/restaurantes');
    }
  }, [cart, navigate]);

  useEffect(() => {
    if (user) {
      const direccionPredeterminada = user.direcciones?.find(dir => dir.predeterminada);
      if (direccionPredeterminada) {
        setDireccionSeleccionada(direccionPredeterminada._id);
      } else if (user.direcciones?.length > 0) {
        setDireccionSeleccionada(user.direcciones[0]._id);
      }
      
      const metodoPagoPredeterminado = user.metodosPago?.find(mp => mp.predeterminado);
      if (metodoPagoPredeterminado) {
        setMetodoPagoSeleccionado(metodoPagoPredeterminado._id);
      } else if (user.metodosPago?.length > 0) {
        setMetodoPagoSeleccionado(user.metodosPago[0]._id);
      }
    }
  }, [user]);

  const getDireccionSeleccionada = () => {
    return user?.direcciones?.find(dir => dir._id === direccionSeleccionada) || null;
  };

  const getMetodoPagoSeleccionado = () => {
    return user?.metodosPago?.find(mp => mp._id === metodoPagoSeleccionado) || null;
  };

  const subtotal = getTotal();
  
  const gastosEnvio = subtotal > 0 ? 2.99 : 0;
  
  const total = subtotal + gastosEnvio;

  const handleSubmitOrder = async () => {
    if (!direccionSeleccionada) {
      toast.error('Debes seleccionar una dirección de entrega');
      return;
    }

    if (!metodoPagoSeleccionado) {
      toast.error('Debes seleccionar un método de pago');
      return;
    }

    try {
      setLoading(true);
      
      const items = cart.map(item => ({
        articulo: item._id,
        cantidad: item.cantidad
      }));
      
      const ordenData = {
        usuario: user._id,
        restaurante: restaurante._id,
        items,
        total: parseFloat(total.toFixed(2)),
        estado: 'pendiente'
      };
      
      await createOrden(ordenData);
      
      setOrdenExitosa(true);
      setIsModalOpen(true);
      
      clearCart();
      
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      toast.error('Hubo un error al procesar tu pedido. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (ordenExitosa) {
      navigate('/ordenes');
    }
  };

  if (!cart || cart.length === 0 || !restaurante) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finalizar Pedido</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
              Tu pedido en {restaurante.nombre}
            </h2>

            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center py-2">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden mr-4">
                    <img
                      src={item.imagen || '/assets/images/default-food.jpg'}
                      alt={item.nombre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/images/default-food.jpg';
                      }}
                    />
                  </div>

                  <div className="flex-grow">
                    <h3 className="font-medium">{item.nombre}</h3>
                    <p className="text-sm text-gray-600">
                      {item.precio.toFixed(2)} € x {item.cantidad}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.cantidad - 1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full"
                    >
                      <FaMinus className="text-gray-600" />
                    </button>
                    <span className="w-6 text-center">{item.cantidad}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.cantidad + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full"
                    >
                      <FaPlus className="text-gray-600" />
                    </button>
                  </div>

                  <div className="flex items-center ml-4 space-x-4">
                    <span className="font-medium">
                      {(item.precio * item.cantidad).toFixed(2)} €
                    </span>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
              Dirección de entrega
            </h2>

            {user && user.direcciones && user.direcciones.length > 0 ? (
              <div className="space-y-4">
                {user.direcciones.map((direccion) => (
                  <div
                    key={direccion._id}
                    className={`border rounded-lg p-4 cursor-pointer 
                      ${direccion._id === direccionSeleccionada
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={() => setDireccionSeleccionada(direccion._id)}
                  >
                    <div className="flex items-start">
                      <div className="mt-1 mr-3">
                        <input
                          type="radio"
                          name="direccion"
                          checked={direccion._id === direccionSeleccionada}
                          onChange={() => setDireccionSeleccionada(direccion._id)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {direccion.titulo}{' '}
                          {direccion.predeterminada && (
                            <span className="ml-2 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                              Predeterminada
                            </span>
                          )}
                        </h3>
                        <p className="text-gray-600">
                          {direccion.calle}, {direccion.ciudad}
                        </p>
                        {direccion.codigoPostal && (
                          <p className="text-gray-600">{direccion.codigoPostal}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">
                  No tienes direcciones guardadas.
                </p>
                <Link to="/direcciones">
                  <Button variant="outline" icon={<FaMapMarkerAlt />}>
                    Añadir dirección
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
              Método de pago
            </h2>

            {user && user.metodosPago && user.metodosPago.length > 0 ? (
              <div className="space-y-4">
                {user.metodosPago.map((metodoPago) => (
                  <div
                    key={metodoPago._id}
                    className={`border rounded-lg p-4 cursor-pointer 
                      ${metodoPago._id === metodoPagoSeleccionado
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={() => setMetodoPagoSeleccionado(metodoPago._id)}
                  >
                    <div className="flex items-start">
                      <div className="mt-1 mr-3">
                        <input
                          type="radio"
                          name="metodoPago"
                          checked={metodoPago._id === metodoPagoSeleccionado}
                          onChange={() => setMetodoPagoSeleccionado(metodoPago._id)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {metodoPago.tipo}
                          {metodoPago.predeterminado && (
                            <span className="ml-2 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                              Predeterminado
                            </span>
                          )}
                        </h3>
                        {metodoPago.tipo === 'Tarjeta' && metodoPago.ultimosDigitos && (
                          <p className="text-gray-600">
                            **** **** **** {metodoPago.ultimosDigitos}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">
                  No tienes métodos de pago guardados.
                </p>
                <Link to="/metodos-pago">
                  <Button variant="outline" icon={<FaCreditCard />}>
                    Añadir método de pago
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>

        <div>
          <Card className="sticky top-4">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
              Resumen del pedido
            </h2>

            <div className="mb-4">
              <h3 className="font-medium mb-2">Restaurante</h3>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden mr-3">
                  <img
                    src={restaurante.imagenes?.[0] || '../../public/assets/images/default-restaurant.png'}
                    alt={restaurante.nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '../../public/assets/images/default-restaurant.png';
                    }}
                  />
                </div>
                <div>
                  <p className="font-medium">{restaurante.nombre}</p>
                  {restaurante.direccion?.ciudad && (
                    <p className="text-sm text-gray-600">{restaurante.direccion.ciudad}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-medium mb-2">Entrega a</h3>
              {getDireccionSeleccionada() ? (
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-primary-500 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700">
                      {getDireccionSeleccionada().calle}
                    </p>
                    <p className="text-gray-700">
                      {getDireccionSeleccionada().ciudad}
                      {getDireccionSeleccionada().codigoPostal &&
                        `, ${getDireccionSeleccionada().codigoPostal}`}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-red-500">Selecciona una dirección de entrega</p>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Pago con</h3>
              {getMetodoPagoSeleccionado() ? (
                <div>
                  <p className="text-gray-700">
                    {getMetodoPagoSeleccionado().tipo}
                    {getMetodoPagoSeleccionado().tipo === 'Tarjeta' &&
                      getMetodoPagoSeleccionado().ultimosDigitos &&
                      ` **** ${getMetodoPagoSeleccionado().ultimosDigitos}`}
                  </p>
                </div>
              ) : (
                <p className="text-red-500">Selecciona un método de pago</p>
              )}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Gastos de envío</span>
                <span>{gastosEnvio.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>

            <Button
              onClick={handleSubmitOrder}
              fullWidth
              size="large"
              loading={loading}
              disabled={!direccionSeleccionada || !metodoPagoSeleccionado || loading}
            >
              Realizar Pedido
            </Button>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={ordenExitosa ? '¡Pedido Realizado con Éxito!' : 'Error en el Pedido'}
        size="small"
      >
        {ordenExitosa ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Tu pedido ha sido procesado correctamente
            </h3>
            <p className="text-gray-600 mb-4">
              Puedes seguir el estado de tu pedido en la sección "Mis Pedidos".
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={handleCloseModal}>
                Cerrar
              </Button>
              <Button onClick={() => navigate('/ordenes')}>
                Ver Mis Pedidos
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Hubo un problema al procesar tu pedido
            </h3>
            <p className="text-gray-600 mb-4">
              Por favor, intenta nuevamente o contacta con soporte si el problema persiste.
            </p>
            <Button onClick={handleCloseModal}>Cerrar</Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CheckoutPage;