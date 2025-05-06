import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticuloMenuById } from '../../api/articulosMenu';
import { getRestauranteById } from '../../api/restaurantes';
import ArticuloDetail from '../../components/menu/ArticuloDetail';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

const ArticuloDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [articulo, setArticulo] = useState(null);
  const [restaurante, setRestaurante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const articuloData = await getArticuloMenuById(id);
        setArticulo(articuloData);
        
        if (articuloData.restaurante_id) {
          const restauranteData = await getRestauranteById(articuloData.restaurante_id);
          setRestaurante(restauranteData);
        }
      } catch (err) {
        setError('Error al cargar la información del artículo');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loading size="large" />
      </div>
    );
  }

  if (error || !articulo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage 
          message={error || 'Artículo no encontrado'} 
          type={error ? 'connection' : 'notFound'} 
          className="mb-6" 
        />
        <div className="text-center">
          <button 
            className="px-4 py-2 bg-primary-600 text-white rounded-lg"
            onClick={() => navigate('/restaurantes')}
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ArticuloDetail 
        articulo={articulo} 
        restaurante={restaurante} 
        onGoBack={handleGoBack} 
      />
    </div>
  );
};

export default ArticuloDetailPage;