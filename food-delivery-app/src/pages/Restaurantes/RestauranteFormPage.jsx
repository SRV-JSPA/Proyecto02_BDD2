import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { getRestauranteById, createRestaurante, updateRestaurante } from '../../api/restaurantes';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { toast } from 'react-toastify';

const RestauranteFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [restaurante, setRestaurante] = useState(null);
  const [loading, setLoading] = useState(id ? true : false);
  const [savingLoading, setSavingLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = !!id;


  useEffect(() => {
    if (isEditing) {
      const fetchRestaurante = async () => {
        try {
          setLoading(true);
          const data = await getRestauranteById(id);
          setRestaurante(data);
          
          setValue('nombre', data.nombre);
          setValue('descripcion', data.descripcion || '');
          setValue('email', data.email || '');
          setValue('telefono', data.telefono || '');
          
          if (data.direccion) {
            setValue('calle', data.direccion.calle || '');
            setValue('ciudad', data.direccion.ciudad || '');
            setValue('codigoPostal', data.direccion.codigoPostal || '');
            setValue('pais', data.direccion.pais || '');
          }
          
          if (data.tiposCocina && data.tiposCocina.length > 0) {
            setValue('tiposCocina', data.tiposCocina.join(', '));
          }
          
          setValue('precioPromedio', data.precioPromedio || '');
        } catch (err) {
          setError('Error al cargar los datos del restaurante');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchRestaurante();
    }
  }, [id, isEditing, setValue]);

  const onSubmit = async (data) => {
    try {
      setSavingLoading(true);
      
      const restauranteData = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        email: data.email,
        telefono: data.telefono,
        direccion: {
          calle: data.calle,
          ciudad: data.ciudad,
          codigoPostal: data.codigoPostal,
          pais: data.pais
        },
        tiposCocina: data.tiposCocina.split(',').map(tipo => tipo.trim()),
        precioPromedio: parseFloat(data.precioPromedio) || 0,
      };
      
      if (isEditing) {
        await updateRestaurante(id, restauranteData);
        toast.success('Restaurante actualizado correctamente');
      } else {
        await createRestaurante(restauranteData);
        toast.success('Restaurante creado correctamente');
      }
      
      navigate('/restaurantes');
    } catch (err) {
      setError('Error al guardar el restaurante');
      toast.error('Error al guardar el restaurante');
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
          {isEditing ? 'Editar Restaurante' : 'Nuevo Restaurante'}
        </h1>
      </div>

      <Card padding="large">
        {error && (
          <ErrorMessage 
            message={error} 
            className="mb-6" 
            onRetry={() => isEditing ? fetchRestaurante() : setError(null)}
          />
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Información básica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  id="nombre"
                  type="text"
                  className={`input-field ${errors.nombre ? 'border-red-500' : ''}`}
                  {...register('nombre', { required: 'El nombre es obligatorio' })}
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  id="telefono"
                  type="text"
                  className="input-field"
                  placeholder="+34 600 00 00 00"
                  {...register('telefono')}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                  {...register('email', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email no válido'
                    }
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="precioPromedio" className="block text-sm font-medium text-gray-700 mb-1">
                  Precio promedio (€)
                </label>
                <input
                  id="precioPromedio"
                  type="number"
                  step="0.01"
                  min="0"
                  className="input-field"
                  {...register('precioPromedio')}
                />
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Dirección</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="calle" className="block text-sm font-medium text-gray-700 mb-1">
                  Calle
                </label>
                <input
                  id="calle"
                  type="text"
                  className="input-field"
                  {...register('calle')}
                />
              </div>
              
              <div>
                <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <input
                  id="ciudad"
                  type="text"
                  className="input-field"
                  {...register('ciudad')}
                />
              </div>
              
              <div>
                <label htmlFor="codigoPostal" className="block text-sm font-medium text-gray-700 mb-1">
                  Código postal
                </label>
                <input
                  id="codigoPostal"
                  type="text"
                  className="input-field"
                  {...register('codigoPostal')}
                />
              </div>
              
              <div>
                <label htmlFor="pais" className="block text-sm font-medium text-gray-700 mb-1">
                  País
                </label>
                <input
                  id="pais"
                  type="text"
                  className="input-field"
                  {...register('pais')}
                />
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Detalles adicionales</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="tiposCocina" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipos de cocina (separados por comas)
                </label>
                <input
                  id="tiposCocina"
                  type="text"
                  className="input-field"
                  placeholder="Italiana, Mediterránea, Vegetariana..."
                  {...register('tiposCocina')}
                />
              </div>
              
              <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  rows="4"
                  className="input-field"
                  {...register('descripcion')}
                />
              </div>
            </div>
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
              {isEditing ? 'Actualizar' : 'Crear'} Restaurante
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RestauranteFormPage;