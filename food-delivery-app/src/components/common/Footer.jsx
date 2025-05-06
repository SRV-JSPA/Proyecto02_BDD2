import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="text-2xl font-bold text-white mb-4 inline-block">
              FoodApp
            </Link>
            <p className="text-gray-300 mb-4">
              Tu plataforma preferida para descubrir y ordenar de los mejores restaurantes de tu ciudad.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="text-xl" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xl" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/restaurantes" className="text-gray-300 hover:text-white transition-colors">
                  Restaurantes
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white transition-colors">
                  Registrarse
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Categorías Populares</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/restaurantes?tipoCocina=Italiana" className="text-gray-300 hover:text-white transition-colors">
                  Comida Italiana
                </Link>
              </li>
              <li>
                <Link to="/restaurantes?tipoCocina=Mexicana" className="text-gray-300 hover:text-white transition-colors">
                  Comida Mexicana
                </Link>
              </li>
              <li>
                <Link to="/restaurantes?tipoCocina=Japonesa" className="text-gray-300 hover:text-white transition-colors">
                  Comida Japonesa
                </Link>
              </li>
              <li>
                <Link to="/restaurantes?tipoCocina=Vegetariana" className="text-gray-300 hover:text-white transition-colors">
                  Comida Vegetariana
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaPhoneAlt className="mr-2 text-primary-400" />
                <span className="text-gray-300">+1 (123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2 text-primary-400" />
                <a href="mailto:info@foodapp.com" className="text-gray-300 hover:text-white transition-colors">
                  info@foodapp.com
                </a>
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="mr-2 text-primary-400 mt-1" />
                <span className="text-gray-300">123 Calle Principal, Ciudad, CP 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {year} FoodApp. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4">
              <Link to="/terminos" className="text-gray-400 text-sm hover:text-white transition-colors">
                Términos y Condiciones
              </Link>
              <Link to="/privacidad" className="text-gray-400 text-sm hover:text-white transition-colors">
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;