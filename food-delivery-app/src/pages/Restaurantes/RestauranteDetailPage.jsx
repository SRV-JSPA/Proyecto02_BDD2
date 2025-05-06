import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getRestauranteById } from '../../api/restaurantes';
import { getMenuRestaurante } from '../../api/articulosMenu';
import { getResenas } from '../../api/resenas';
import RestauranteDetail from '../../components/restaurantes/RestauranteDetail';
import CategoriaMenu from '../../components/menu/CategoriaMenu';
import ResenaCard from '../../components/resenas/ResenaCard';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Button from '../../components/common/Button';
import { FaUtensils, FaStar } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const RestauranteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [restaurante, setRestaurante] = useState(null);
  const [especiales, setEspeciales] = useState([]);
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const restauranteData = await getRestauranteById(id);
        setRestaurante(restauranteData);
        
        const menuData = await getMenuRestaurante(id, { disponibles: true });
        setEspeciales(menuData.especiales || []);
        
        const resenasData = await getResenas({ 
          restauranteId: id,
          ordenarPor: 'calificacion',
          limite: 3
        });
        setResenas(resenasData.resenas || []);
        
      } catch (err) {
        setError('Error al cargar información del restaurante');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[500px] flex justify-center items-center">
        <Loading size="large" />
      </div>
    );
  }

  if (error || !restaurante) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage 
          message={error || 'Restaurante no encontrado'} 
          type={error ? 'connection' : 'notFound'} 
          className="max-w-xl mx-auto" 
        />
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/restaurantes')}
          >
            Volver a Restaurantes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 border-b">
        <div className="flex overflow-x-auto">
          <button
            className={`py-3 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'info'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('info')}
          >
            Información
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'menu'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('menu')}
          >
            Menú
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'resenas'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('resenas')}
          >
            Reseñas
          </button>
        </div>
      </div>

      <div>
        {activeTab === 'info' && (
          <div>
            <RestauranteDetail restaurante={restaurante} />
            
            {especiales.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Especiales del día
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {especiales.map((articulo) => (
                    <div 
                      key={articulo._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden border border-primary-100"
                    >
                      <div 
                        className="h-48 bg-cover bg-center" 
                        style={{ 
                          backgroundImage: `url(${articulo.imagen || '/assets/images/default-food.jpg'})` 
                        }}
                      />
                      <div className="p-4">
                        <h3 className="font-bold mb-1">{articulo.nombre}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {articulo.descripcion?.substring(0, 80)}
                          {articulo.descripcion?.length > 80 ? '...' : ''}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-primary-600">
                            {articulo.precio.toFixed(2)} €
                          </span>
                          <Link to={`/menu/articulo/${articulo._id}`}>
                            <Button variant="outline" size="small">
                              Ver detalle
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Link to={`/menu/${restaurante._id}`}>
                    <Button icon={<FaUtensils />}>
                      Ver menú completo
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold mb-8">Nuestro Menú</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Descubre nuestra variedad de platos preparados con los mejores ingredientes.
            </p>
            <Link to={`/menu/${restaurante._id}`}>
              <Button size="large" icon={<FaUtensils />}>
                Explorar menú completo
              </Button>
            </Link>
          </div>
        )}

        {activeTab === 'resenas' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Reseñas</h2>
              {user && (
                <Link to={`/resenas/nuevo/${restaurante._id}`}>
                  <Button variant="outline" icon={<FaStar />}>
                    Añadir reseña
                  </Button>
                </Link>
              )}
            </div>

            {resenas.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">
                  Todavía no hay reseñas para este restaurante.
                </p>
                {user ? (
                  <Link to={`/resenas/nuevo/${restaurante._id}`}>
                    <Button variant="outline" icon={<FaStar />}>
                      Sé el primero en añadir una reseña
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button variant="outline">
                      Inicia sesión para añadir una reseña
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {resenas.map((resena) => (
                  <ResenaCard key={resena._id} resena={resena} />
                ))}
                <div className="text-center mt-8">
                  <Link to={`/resenas?restauranteId=${restaurante._id}`}>
                    <Button variant="outline">
                      Ver todas las reseñas
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestauranteDetailPage;