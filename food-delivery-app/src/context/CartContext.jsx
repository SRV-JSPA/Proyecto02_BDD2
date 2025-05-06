import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [restaurante, setRestaurante] = useState(null);
  
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedRestaurante = localStorage.getItem('restaurante');
    
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    if (savedRestaurante) {
      setRestaurante(JSON.parse(savedRestaurante));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    if (restaurante) {
      localStorage.setItem('restaurante', JSON.stringify(restaurante));
    }
  }, [cart, restaurante]);
  
  const addToCart = (item, restauranteActual) => {
    if (restaurante && restauranteActual._id !== restaurante._id) {
      if (window.confirm(
        `Ya tienes artículos de ${restaurante.nombre} en tu carrito. ¿Deseas vaciar el carrito y agregar este artículo de ${restauranteActual.nombre}?`
      )) {
        setCart([{ ...item, cantidad: 1 }]);
        setRestaurante(restauranteActual);
        toast.success(`Se ha agregado ${item.nombre} al carrito`);
      }
      return;
    }
    
    if (!restaurante) {
      setRestaurante(restauranteActual);
    }
    
    const itemIndex = cart.findIndex((cartItem) => cartItem._id === item._id);
    
    if (itemIndex >= 0) {
      const newCart = [...cart];
      newCart[itemIndex].cantidad += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { ...item, cantidad: 1 }]);
    }
    
    toast.success(`Se ha agregado ${item.nombre} al carrito`);
  };
  
  const removeFromCart = (itemId) => {
    const newCart = cart.filter((item) => item._id !== itemId);
    setCart(newCart);
    
    if (newCart.length === 0) {
      setRestaurante(null);
      localStorage.removeItem('restaurante');
    }
    
    toast.info('Artículo eliminado del carrito');
  };
  
  const updateQuantity = (itemId, cantidad) => {
    if (cantidad <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    const newCart = cart.map((item) => 
      item._id === itemId ? { ...item, cantidad } : item
    );
    
    setCart(newCart);
  };
  
  const clearCart = () => {
    setCart([]);
    setRestaurante(null);
    localStorage.removeItem('cart');
    localStorage.removeItem('restaurante');
    toast.info('Carrito vaciado');
  };
  
  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };
  
  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.cantidad, 0);
  };
  
  const value = {
    cart,
    restaurante,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};