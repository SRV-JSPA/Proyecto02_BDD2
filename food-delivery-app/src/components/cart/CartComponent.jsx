import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';
import Card from '../common/Card';
import Button from '../common/Button';


const CartComponent = ({ isFullPage = false, onClose = null }) => {
  const { 
    cart, 
    restaurante, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getTotal 
  } = useCart();

  const handleQuantityChange = (itemId, increment) => {
    const item = cart.find(item => item._id === itemId);
    if (item) {
      const newQuantity = item.cantidad + increment;
      updateQuantity(itemId, newQuantity);
    }
  };

  if (cart.length === 0) {
    return (
      <div className={`${isFullPage ? '' : 'p-4'}`}>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <FaShoppingCart className="text-2xl text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tu carrito está vacío
          </h3>
          <p className="text-gray-500 mb-4">
            Añade productos de un restaurante para realizar un pedido
          </p>
          <Link to="/restaurantes">
            <Button>Explorar restaurantes</Button>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getTotal();
  const gastosEnvio = subtotal > 0 ? 2.99 : 0;
  const total = subtotal + gastosEnvio;

  return (
    <div className={`${isFullPage ? '' : 'p-4'}`}>
      {restaurante && (
        <div className="mb-4 pb-4 border-b">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3">
              <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden">
                <img
                  src={restaurante.imagenes?.[0] || '../../../public/assets/images/default-restaurant.png'}
                  alt={restaurante.nombre}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '../../public/assets/images/default-restaurant.png';
                  }}
                />
              </div>
            </div>
            <div>
              <h3 className="font-medium">{restaurante.nombre}</h3>
              {restaurante.direccion?.ciudad && (
                <p className="text-sm text-gray-600">{restaurante.direccion.ciudad}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <h3 className="font-medium mb-2">Tu pedido</h3>
        <div className="space-y-3 max-h-[calc(100vh-380px)] overflow-y-auto">
          {cart.map((item) => (
            <div key={item._id} className="flex items-center py-2 border-b last:border-b-0">
              <div className="flex-grow">
                <p className="font-medium">{item.nombre}</p>
                <p className="text-sm text-gray-600">{item.precio.toFixed(2)} €</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(item._id, -1)}
                  className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full"
                  aria-label="Disminuir cantidad"
                >
                  <FaMinus className="text-gray-600 text-xs" />
                </button>
                <span className="w-5 text-center">{item.cantidad}</span>
                <button
                  onClick={() => handleQuantityChange(item._id, 1)}
                  className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full"
                  aria-label="Aumentar cantidad"
                >
                  <FaPlus className="text-gray-600 text-xs" />
                </button>
              </div>
              
              <div className="ml-4 flex items-center space-x-2">
                <p className="font-medium whitespace-nowrap">
                  {(item.precio * item.cantidad).toFixed(2)} €
                </p>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-600"
                  aria-label="Eliminar item"
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between py-2">
          <span className="text-gray-600">Subtotal</span>
          <span>{subtotal.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-gray-600">Gastos de envío</span>
          <span>{gastosEnvio.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between py-2 font-bold border-t mt-2 pt-2">
          <span>Total</span>
          <span>{total.toFixed(2)} €</span>
        </div>
      </div>

      <div className="space-y-2">
        <Link to="/checkout" className={isFullPage ? 'mr-2' : ''}>
          <Button fullWidth={!isFullPage}>
            Realizar pedido
          </Button>
        </Link>
        
        {isFullPage && (
          <Button 
            variant="outline" 
            onClick={clearCart}
            className="mr-2"
          >
            Vaciar carrito
          </Button>
        )}
        
        {!isFullPage && (
          <Button 
            variant="outline" 
            fullWidth 
            onClick={onClose || clearCart}
          >
            {onClose ? 'Cerrar' : 'Vaciar carrito'}
          </Button>
        )}
      </div>
    </div>
  );
};


export const CartModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h2 className="text-lg font-medium">Tu carrito</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <CartComponent onClose={onClose} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export const CartPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mi Carrito</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card padding="large">
            <CartComponent isFullPage />
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Resumen</h2>
            
            <div className="mb-4">
              <Link to="/restaurantes">
                <Button variant="outline" fullWidth>
                  Continuar comprando
                </Button>
              </Link>
            </div>
            
            <div className="mb-4 p-4 bg-primary-50 rounded-lg">
              <h3 className="font-medium mb-2">Información de entrega</h3>
              <p className="text-sm text-gray-600">
                El tiempo estimado de entrega es de 30-45 minutos una vez confirmado el pedido.
              </p>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>
                Al completar tu compra, aceptas nuestros{' '}
                <Link to="/terminos" className="text-primary-600 hover:text-primary-700">
                  Términos y condiciones
                </Link>
                .
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartComponent;