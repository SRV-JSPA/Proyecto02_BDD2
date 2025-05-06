import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            FoodApp
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Inicio
            </Link>
            <Link to="/restaurantes" className="text-gray-700 hover:text-primary-600 transition-colors">
              Restaurantes
            </Link>
            {user && (
              <>
                <Link to="/ordenes" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Mis Pedidos
                </Link>
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/checkout" className="relative">
                  <FaShoppingCart className="text-2xl text-gray-700 hover:text-primary-600 transition-colors" />
                  {getItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getItemCount()}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
                    <FaUserCircle className="text-2xl" />
                    <span>{user.nombre}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link to="/perfil" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Mi Perfil
                    </Link>
                    <Link to="/direcciones" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Mis Direcciones
                    </Link>
                    <Link to="/metodos-pago" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Métodos de Pago
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden text-gray-700" onClick={toggleMenu}>
            {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors" onClick={toggleMenu}>
                Inicio
              </Link>
              <Link
                to="/restaurantes"
                className="text-gray-700 hover:text-primary-600 transition-colors"
                onClick={toggleMenu}
              >
                Restaurantes
              </Link>
              {user ? (
                <>
                  <Link
                    to="/ordenes"
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={toggleMenu}
                  >
                    Mis Pedidos
                  </Link>
                  <Link
                    to="/perfil"
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={toggleMenu}
                  >
                    Mi Perfil
                  </Link>
                  <Link
                    to="/checkout"
                    className="flex items-center justify-between text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={toggleMenu}
                  >
                    <span>Mi Carrito</span>
                    {getItemCount() > 0 && (
                      <span className="bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getItemCount()}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="flex items-center text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg text-center text-primary-600 hover:bg-primary-50 transition-colors"
                    onClick={toggleMenu}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-lg text-center bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                    onClick={toggleMenu}
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;