
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaArrowLeft, FaSave, FaStar } from 'react-icons/fa';
import { getResenaById, createResena, updateResena } from '../../api/resenas';
import { getRestauranteById } from '../../api/restaurantes';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import StarRating from '../../components/common/StarRating';
import { toast } from 'react-toastify';

const ResenaFormPage = () => {
  const { restauranteId, id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const [restaurante, setRestaurante] = useState(null);
  const [resena, setResena] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingLoading, setSavingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(5);

  const isEditing = !!id;
  const watchCalificacion = watch('calificacion', rating);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (isEditing) {
          const resenaData = await getResenaById(id);
          setResena(resenaData);
          
          setValue('comentario', resenaData.comentario || '');
          setValue('calificacion', resenaData.calificacion || 5);
          setRating(resenaData.calificacion || 5);
          
          if (resenaData.restaurante) {
            const restauranteData = await getRestauranteById(resenaData.restaurante);
            setRestaurante(restauranteData);
          }
        } else if (restauranteId) {
          const restauranteData = await getRestauranteById(restauranteId);
          setRestaurante(restauranteData);
          
          setValue('calificacion', 5);
        }
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, restauranteId, isEditing, setValue]);

  const handleRatingChange = (value) => {
    setRating(value);
    setValue('calificacion', value);
  };

  const onSubmit = async (data) => {
    if (!user) {
      toast.error('Debes iniciar sesión para publicar una reseña');
      navigate('/login');
      return;
    }
    
    try {
      setSavingLoading(true);
      
      const resenaData = {
        comentario: data.comentario,
        calificacion: data.calificacion,
        restaurante: restauranteId || resena?.restaurante,
        usuario: user._id
      };
      
      if (isEditing) {
        await updateResena(id, resenaData);
        toast.success('Reseña actualizada correctamente');
      } else {
        await createResena(resenaData);
        toast.success('Reseña publicada correctamente');
      }
      
      navigate(`/restaurantes/${restauranteId || resena?.restaurante}`);
    } catch (err) {
      setError('Error al guardar la reseña');
      toast.error('Error al guardar la reseña');
      console.error(err);
    } finally {
      setSavingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loading size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <h3 className="text-xl font-medium mb-4">Necesitas iniciar sesión</h3>
          <p className="text-gray-600 mb-6">
            Para escribir una reseña, necesitas iniciar sesión en tu cuenta.
          </p>
          <Button onClick={() => navigate('/login')}>
            Iniciar sesión
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Editar reseña' : 'Escribir reseña'}
        </h1>
      </div>

      {restaurante && (
        <div className="mb-6">
          <Card className="bg-gray-50">
            <p className="text-gray-600">
              Restaurante: <span className="font-medium">{restaurante.nombre}</span>
            </p>
            {restaurante.direccion?.ciudad && (
              <p className="text-gray-600 text-sm">
                {restaurante.direccion.ciudad}
              </p>
            )}
          </Card>
        </div>
      )}

      <Card padding="large">
        {error && (
          <ErrorMessage 
            message={error} 
            className="mb-6" 
          />
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu calificación
            </label>
            <div className="flex items-center space-x-2">
              <StarRating 
                value={rating} 
                readOnly={false} 
                onChange={handleRatingChange}
                size="large"
              />
              <span className="ml-2 text-gray-600">
                {watchCalificacion}/5
              </span>
              <input
                type="hidden"
                {...register('calificacion', { required: true })}
                value={rating}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 mb-2">
              Tu comentario
            </label>
            <textarea
              id="comentario"
              rows="6"
              className={`input-field ${errors.comentario ? 'border-red-500' : ''}`}
              placeholder="Comparte tu experiencia con este restaurante..."
              {...register('comentario', {
                required: 'El comentario es obligatorio',
                minLength: {
                  value: 10,
                  message: 'El comentario debe tener al menos 10 caracteres'
                }
              })}
            />
            {errors.comentario && (
              <p className="mt-1 text-sm text-red-600">{errors.comentario.message}</p>
            )}
          </div>
          
          <div className="flex justify-end pt-4 space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              icon={<FaSave />}
              loading={savingLoading}
              disabled={savingLoading}
            >
              {isEditing ? 'Actualizar' : 'Publicar'} reseña
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ResenaFormPage;