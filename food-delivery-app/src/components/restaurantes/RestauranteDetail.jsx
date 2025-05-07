import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaUtensils, FaStar } from 'react-icons/fa';
import StarRating from '../common/StarRating';
import Button from '../common/Button';
import Card from '../common/Card';

const RestauranteDetail = ({ restaurante }) => {
  if (!restaurante) return null;

  const {
    _id,
    nombre,
    direccion,
    telefono,
    email,
    horario,
    tiposCocina = [],
    calificacionPromedio = 0,
    precioPromedio = 0,
    imagenes = [],
    descripcion
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

  const galeriaImagenes = imagenes.slice(1);

  const formatHorario = (horarioObj) => {
    if (!horarioObj) return 'No disponible';
    
    const dias = {
      lunes: 'Lunes',
      martes: 'Martes',
      miercoles: 'Miércoles',
      jueves: 'Jueves',
      viernes: 'Viernes',
      sabado: 'Sábado',
      domingo: 'Domingo'
    };
    
    return Object.entries(horarioObj).map(([dia, horas]) => {
      if (!horas || !horas.apertura || !horas.cierre) {
        return `${dias[dia]}: Cerrado`;
      }
      return `${dias[dia]}: ${horas.apertura} - ${horas.cierre}`;
    });
  };

  const horarioFormateado = horario ? formatHorario(horario) : [];

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="h-64 md:h-80 overflow-hidden rounded-xl">
          <img
            src={imagenPrincipal}
            alt={nombre}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '../../../public/assets/images/default-restaurant.png';
            }}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <h1 className="text-white text-3xl font-bold">{nombre}</h1>
          <div className="flex items-center mt-2">
            <StarRating value={calificacionPromedio} readOnly={true} color="gold" />
            <span className="ml-2 text-white">
              {calificacionPromedio.toFixed(1)} ({getPrecioSymbol()})
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {descripcion && (
            <Card>
              <h2 className="text-xl font-semibold mb-3">Acerca de</h2>
              <p className="text-gray-700">{descripcion}</p>
            </Card>
          )}

          {galeriaImagenes.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold mb-3">Galería</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {galeriaImagenes.map((imagen, index) => (
                  <div key={index} className="h-32 overflow-hidden rounded-lg">
                    <img
                      src={imagen}
                      alt={`${nombre} - Imagen ${index + 2}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '../../public/assets/images/default-restaurant.png';
                      }}
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="flex justify-center mt-6">
            <Link to={`/menu/${_id}`}>
              <Button size="large" icon={<FaUtensils />}>
                Ver Menú Completo
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold mb-3">Información de contacto</h2>
            <ul className="space-y-3">
              {direccion && (
                <li className="flex items-start">
                  <FaMapMarkerAlt className="text-primary-500 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700">
                      {direccion.calle && `${direccion.calle}, `}
                      {direccion.ciudad && `${direccion.ciudad}, `}
                      {direccion.codigoPostal && `${direccion.codigoPostal}, `}
                      {direccion.pais && direccion.pais}
                    </p>
                  </div>
                </li>
              )}
              
              {telefono && (
                <li className="flex items-center">
                  <FaPhone className="text-primary-500 mr-2 flex-shrink-0" />
                  <a href={`tel:${telefono}`} className="text-gray-700 hover:text-primary-500">
                    {telefono}
                  </a>
                </li>
              )}
              
              {email && (
                <li className="flex items-center">
                  <FaEnvelope className="text-primary-500 mr-2 flex-shrink-0" />
                  <a href={`mailto:${email}`} className="text-gray-700 hover:text-primary-500">
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </Card>

          {horarioFormateado.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold mb-3">Horario</h2>
              <ul className="space-y-1">
                {horarioFormateado.map((horario, index) => (
                  <li key={index} className="flex items-center">
                    <FaClock className="text-primary-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{horario}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {tiposCocina.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold mb-3">Tipos de cocina</h2>
              <div className="flex flex-wrap gap-2">
                {tiposCocina.map((tipo, index) => (
                  <span
                    key={index}
                    className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tipo}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestauranteDetail;