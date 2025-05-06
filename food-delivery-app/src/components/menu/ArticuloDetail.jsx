import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaArrowLeft, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import Card from '../common/Card';
import Button from '../common/Button';
import { useCart } from '../../hooks/useCart';

const ArticuloDetail = ({ articulo, restaurante, onGoBack }) => {
  const { addToCart } = useCart();

  if (!articulo) return null;

  const {
    _id,
    nombre,
    descripcion,
    precio,
    categoria,
    ingredientes = [],
    alergenos = [],
    aptoPara = [],
    imagen,
    disponible = true,
    especialDelDia = false,
    popularidad = 0
  } = articulo;

  const handleAddToCart = () => {
    if (!disponible) return;
    addToCart(articulo, restaurante);
  };

  const getPopularidadLevel = (popularidad) => {
    if (popularidad >= 80) return 'Muy popular';
    if (popularidad >= 60) return 'Popular';
    if (popularidad >= 40) return 'Recomendado';
    return 'Normal';
  };

  const popularidadLevel = getPopularidadLevel(popularidad);

  const imagenArticulo = imagen || '/assets/images/default-food.jpg';

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Button
          variant="outline"
          size="small"
          icon={<FaArrowLeft />}
          onClick={onGoBack}
        >
          Volver
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2">
          <div className="relative">
            <img
              src={imagenArticulo}
              alt={nombre}
              className="w-full rounded-lg shadow-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/images/default-food.jpg';
              }}
            />
            
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {especialDelDia && (
                <span className="bg-secondary-500 text-white py-1 px-3 rounded-full text-sm font-medium shadow-sm">
                  Especial del día
                </span>
              )}
              
              {popularidad >= 60 && (
                <span className="bg-primary-500 text-white py-1 px-3 rounded-full text-sm font-medium shadow-sm">
                  {popularidadLevel}
                </span>
              )}
              
              {!disponible && (
                <span className="bg-red-500 text-white py-1 px-3 rounded-full text-sm font-medium shadow-sm">
                  No disponible
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <Card padding="large">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{nombre}</h1>
              
              {restaurante && (
                <div className="text-primary-600 mb-2">
                  <Link to={`/restaurantes/${restaurante._id}`} className="hover:underline">
                    {restaurante.nombre}
                  </Link>
                  {restaurante.direccion?.ciudad && ` - ${restaurante.direccion.ciudad}`}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary-600">
                  {precio?.toFixed(2) || '0.00'} €
                </span>
                
                <div className="text-sm text-gray-600">
                  Categoría: <span className="font-medium">{categoria}</span>
                </div>
              </div>
            </div>

            {descripcion && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Descripción</h2>
                <p className="text-gray-700">{descripcion}</p>
              </div>
            )}

            {ingredientes.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Ingredientes</h2>
                <div className="flex flex-wrap gap-2">
                  {ingredientes.map((ingrediente, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {ingrediente}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Apto para</h2>
                {aptoPara.length > 0 ? (
                  <ul className="space-y-1">
                    {aptoPara.map((dieta, index) => (
                      <li key={index} className="flex items-center">
                        <FaCheck className="text-green-500 mr-2" />
                        <span>{dieta}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No hay información disponible</p>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Alérgenos</h2>
                {alergenos.length > 0 ? (
                  <ul className="space-y-1">
                    {alergenos.map((alergeno, index) => (
                      <li key={index} className="flex items-center">
                        <FaExclamationTriangle className="text-amber-500 mr-2" />
                        <span>{alergeno}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-green-600 flex items-center">
                    <FaCheck className="mr-2" />
                    Sin alérgenos declarados
                  </p>
                )}
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!disponible}
              variant={disponible ? 'primary' : 'outline'}
              fullWidth
              size="large"
              icon={<FaShoppingCart />}
            >
              {disponible ? 'Añadir al carrito' : 'No disponible'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ArticuloDetail;