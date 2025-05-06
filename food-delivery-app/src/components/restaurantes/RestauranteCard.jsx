import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaUtensils } from 'react-icons/fa';
import Card from '../common/Card';
import StarRating from '../common/StarRating';

const RestauranteCard = ({ restaurante }) => {
  const {
    _id,
    nombre,
    direccion,
    tiposCocina = [],
    calificacionPromedio = 0,
    precioPromedio = 0,
    imagenes = []
  } = restaurante;

  const getPrecioSymbol = () => {
    if (precioPromedio <= 10) return '$';
    if (precioPromedio <= 20) return '$$';
    if (precioPromedio <= 30) return '$$$';
    return '$$$$';
  };

  const imagenPrincipal = imagenes.length > 0 
    ? imagenes[0] 
    : '../../../public/assets/images/default-restaurant.png';

  return (
    <Card className="h-full flex flex-col transition-transform duration-300 hover:scale-[1.02]">
      <Link to={`/restaurantes/${_id}`} className="flex flex-col h-full">
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          <img
            src={imagenPrincipal}
            alt={nombre}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '../../../public/assets/images/default-restaurant.png';
            }}
          />
          <div className="absolute top-3 right-3 flex flex-wrap justify-end gap-1 max-w-[70%]">
            {tiposCocina.slice(0, 2).map((tipo, index) => (
              <span
                key={index}
                className="bg-white bg-opacity-90 text-gray-800 text-xs font-medium px-2 py-1 rounded"
              >
                {tipo}
              </span>
            ))}
            {tiposCocina.length > 2 && (
              <span className="bg-white bg-opacity-90 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                +{tiposCocina.length - 2}
              </span>
            )}
          </div>
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-xl font-semibold mb-1 text-gray-800">{nombre}</h3>
          
          {direccion?.ciudad && (
            <div className="flex items-center text-gray-600 mb-2">
              <FaMapMarkerAlt className="mr-1 text-gray-400" />
              <span className="text-sm">{direccion.ciudad}</span>
            </div>
          )}
          
          <div className="flex items-center text-gray-600 mb-2">
            <FaUtensils className="mr-1 text-gray-400" />
            <span className="text-sm">
              {tiposCocina.slice(0, 3).join(', ')}
              {tiposCocina.length > 3 ? '...' : ''}
            </span>
          </div>
          
          <div className="mt-auto pt-3 flex items-center justify-between">
            <div className="flex items-center">
              <StarRating value={calificacionPromedio} readOnly={true} size="small" />
              <span className="ml-1 text-sm text-gray-600">
                {calificacionPromedio.toFixed(1)}
              </span>
            </div>
            
            <div className="text-sm font-medium text-gray-700">
              {getPrecioSymbol()}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default RestauranteCard;