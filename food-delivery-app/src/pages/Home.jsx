import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUtensils, FaStar, FaMotorcycle } from 'react-icons/fa';
import { getRestaurantes } from '../api/restaurantes';
import RestauranteCard from '../components/restaurantes/RestauranteCard';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';

const tiposCocinaDestacados = [
  { nombre: 'Italiana', icono: '🍕' },
  { nombre: 'Japonesa', icono: '🍣' },
  { nombre: 'Mexicana', icono: '🌮' },
  { nombre: 'India', icono: '🍛' },
  { nombre: 'Americana', icono: '🍔' },
  { nombre: 'Vegetariana', icono: '🥗' }
];

const Home = () => {
  const [restaurantesDestacados, setRestaurantesDestacados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRestaurantesDestacados = async () => {
      try {
        setLoading(true);
        const data = await getRestaurantes();
        console.log(data);
        setRestaurantesDestacados(data.restaurantes || []);
      } catch (err) {
        setError('Error al cargar restaurantes destacados');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantesDestacados();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      window.location.href = `/restaurantes?q=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <div>
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Descubre los mejores restaurantes en tu ciudad
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Miles de opciones gastronómicas a un clic de distancia. ¡Pide ahora!
            </p>

            <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
              <div className="flex">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Busca restaurantes, cocinas, platos..."
                    className="w-full pl-12 pr-4 py-4 rounded-l-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <FaSearch className="text-gray-400 text-lg" />
                  </div>
                </div>
                <Button type="submit" size="large" className="rounded-l-none">
                  Buscar
                </Button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary-500 p-3 rounded-full">
                    <FaUtensils className="text-white text-2xl" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Variedad Culinaria</h3>
                <p className="text-primary-100">
                  Descubre una amplia variedad de restaurantes y cocinas de todo el mundo.
                </p>
              </div>

              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary-500 p-3 rounded-full">
                    <FaStar className="text-white text-2xl" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Los Mejor Valorados</h3>
                <p className="text-primary-100">
                  Conoce las opiniones de otros usuarios y elige los restaurantes mejor valorados.
                </p>
              </div>

              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary-500 p-3 rounded-full">
                    <FaMotorcycle className="text-white text-2xl" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Entrega Rápida</h3>
                <p className="text-primary-100">
                  Recibe tu pedido rápidamente en la comodidad de tu hogar u oficina.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Explora por Tipo de Cocina
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {tiposCocinaDestacados.map((tipo) => (
              <Link
                key={tipo.nombre}
                to={`/restaurantes?tipoCocina=${encodeURIComponent(tipo.nombre)}`}
                className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-2">{tipo.icono}</div>
                <h3 className="font-medium text-gray-800">{tipo.nombre}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Restaurantes Destacados
          </h2>

          {loading ? (
            <div className="flex justify-center">
              <Loading size="large" />
            </div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurantesDestacados.map((restaurante) => (
                  <RestauranteCard key={restaurante._id} restaurante={restaurante} />
                ))}
              </div>

              <div className="text-center mt-12">
                <Link to="/restaurantes">
                  <Button size="large">Ver todos los restaurantes</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-16 bg-secondary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            ¿Tienes hambre? Ordena ahora
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Disfruta de la mejor comida de tu ciudad sin salir de casa. Miles de restaurantes te esperan.
          </p>
          <Link to="/restaurantes">
            <Button
              size="large"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-secondary-600"
            >
              Explorar restaurantes
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;