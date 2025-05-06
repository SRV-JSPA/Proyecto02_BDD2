import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaInfoCircle } from 'react-icons/fa';
import Card from '../common/Card';
import Button from '../common/Button';
import { useCart } from '../../hooks/useCart';

const ArticuloCard = ({ articulo, restaurante, showRestaurante = false }) => {
  const { addToCart } = useCart();
  const [showDescription, setShowDescription] = useState(false);

  const {
    _id,
    nombre,
    descripcion,
    precio,
    imagen,
    ingredientes = [],
    disponible = true,
    especialDelDia = false,
    aptoPara = [],
    alergenos = []
  } = articulo;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!disponible) return;
    
    addToCart(articulo, restaurante);
  };

  const toggleDescription = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDescription(!showDescription);
  };

  const imagenArticulo = imagen || '/assets/images/default-food.jpg';

  return (
    <Card 
      className={`h-full transition-all duration-300 hover:shadow-lg 
        ${!disponible ? 'opacity-70 grayscale' : ''}`}
    >
      <Link 
        to={`/menu/articulo/${_id}`} 
        className="block h-full"
      >
        <div className="relative">
          <div className="h-48 overflow-hidden rounded-t-lg">
            <img
              src={imagenArticulo}
              alt={nombre}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/images/default-food.jpg';
              }}
            />
          </div>

          {especialDelDia && (
            <div className="absolute top-3 left-3 bg-secondary-500 text-white py-1 px-3 rounded-full text-xs font-medium">
              Especial del día
            </div>
          )}
          
          {!disponible && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40 rounded-t-lg">
              <span className="bg-red-500 text-white py-1 px-3 rounded-full text-sm font-medium">
                No disponible
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{nombre}</h3>
            <span className="text-lg font-bold text-primary-600">
              {precio.toFixed(2)} €
            </span>
          </div>

          {showRestaurante && restaurante && (
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Restaurante:</span> {restaurante.nombre}
            </p>
          )}

          {descripcion && (
            <div className="mb-3">
              <button
                onClick={toggleDescription}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
              >
                <FaInfoCircle className="mr-1" />
                {showDescription ? 'Ocultar detalles' : 'Ver detalles'}
              </button>

              {showDescription && (
                <div className="mt-2 text-sm text-gray-700">
                  <p>{descripcion}</p>

                  {ingredientes.length > 0 && (
                    <div className="mt-2">
                      <span className="font-medium">Ingredientes:</span>{' '}
                      {ingredientes.join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {aptoPara.length > 0 && (
            <div className="flex flex-wrap gap-1 my-2">
              {aptoPara.slice(0, 3).map((dieta, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full"
                >
                  {dieta}
                </span>
              ))}
              {aptoPara.length > 3 && (
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  +{aptoPara.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="mt-3">
            <Button
              onClick={handleAddToCart}
              disabled={!disponible}
              variant={disponible ? 'primary' : 'outline'}
              fullWidth
              size="small"
              icon={<FaPlus />}
            >
              {disponible ? 'Añadir al carrito' : 'No disponible'}
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ArticuloCard;