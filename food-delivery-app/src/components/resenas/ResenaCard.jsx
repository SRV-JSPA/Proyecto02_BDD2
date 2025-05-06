import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaEdit, FaTrash } from 'react-icons/fa';
import Card from '../common/Card';
import StarRating from '../common/StarRating';

const ResenaCard = ({ 
  resena, 
  showRestaurante = false, 
  showUser = true,
  canEdit = false, 
  onDelete = null
}) => {
  if (!resena) return null;

  const {
    _id,
    usuario,
    restaurante,
    comentario,
    calificacion,
    fecha
  } = resena;

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <div className="flex flex-col md:flex-row">
        <div className="flex items-start md:w-1/4 mb-4 md:mb-0">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
            <FaUser className="text-gray-500 text-lg" />
          </div>
          <div>
            {showUser && usuario && (
              <p className="font-medium">{usuario.nombre || 'Usuario'}</p>
            )}
            <div className="flex items-center text-sm text-gray-500">
              <FaCalendarAlt className="mr-1" />
              <span>{formatDate(fecha)}</span>
            </div>
          </div>
        </div>

        <div className="md:w-3/4">
          {showRestaurante && restaurante && (
            <Link to={`/restaurantes/${restaurante._id}`} className="block mb-2 text-primary-600 hover:underline">
              {restaurante.nombre}
            </Link>
          )}

          <div className="mb-2">
            <StarRating value={calificacion} readOnly={true} showValue={true} />
          </div>

          {comentario && (
            <p className="text-gray-700">{comentario}</p>
          )}

          {canEdit && (
            <div className="mt-4 flex justify-end space-x-2">
              <Link to={`/resenas/editar/${_id}`} className="text-primary-600 hover:text-primary-700">
                <FaEdit />
              </Link>
              {onDelete && (
                <button 
                  onClick={() => onDelete(_id)} 
                  className="text-red-600 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ResenaCard;