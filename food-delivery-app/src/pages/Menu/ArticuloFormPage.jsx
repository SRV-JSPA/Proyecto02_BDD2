import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { getArticuloMenuById, createArticuloMenu, updateArticuloMenu } from '../../api/articulosMenu';
import { getRestauranteById } from '../../api/restaurantes';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { toast } from 'react-toastify';

const ArticuloFormPage = () => {
  const { id, restauranteId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [articulo, setArticulo] = useState(null);
  const [restaurante, setRestaurante] = useState(null);
  const [loading, setLoading] = useState(id || restauranteId ? true : false);
  const [savingLoading, setSavingLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = !!id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (isEditing) {
          const articuloData = await getArticuloMenuById(id);
          setArticulo(articuloData);
          
          setValue('nombre', articuloData.nombre);
          setValue('descripcion', articuloData.descripcion || '');
          setValue('precio', articuloData.precio || '');
          setValue('categoria', articuloData.categoria || '');
          setValue('ingredientes', articuloData.ingredientes?.join(', ') || '');
          setValue('alergenos', articuloData.alergenos?.join(', ') || '');
          setValue('aptoPara', articuloData.aptoPara?.join(', ') || '');
          setValue('disponible', articuloData.disponible || false);
          setValue('especialDelDia', articuloData.especialDelDia || false);
          
          if (articuloData.restaurante_id && !restauranteId) {
            const restauranteData = await getRestauranteById(articuloData.restaurante_id);
            setRestaurante(restauranteData);
          }
        } else if (restauranteId) {
          const restauranteData = await getRestauranteById(restauranteId);
          setRestaurante(restauranteData);
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

  const onSubmit = async (data) => {
    try {
      setSavingLoading(true);
      
      const articuloData = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: parseFloat(data.precio) || 0,
        categoria: data.categoria,
        restaurante_id: isEditing ? articulo.restaurante_id : restauranteId,
        ingredientes: data.ingredientes ? data.ingredientes.split(',').map(item => item.trim()) : [],
        alergenos: data.alergenos ? data.alergenos.split(',').map(item => item.trim()) : [],
        aptoPara: data.aptoPara ? data.aptoPara.split(',').map(item => item.trim()) : [],
        disponible: data.disponible,
        especialDelDia: data.especialDelDia,
      };
      
      if (isEditing) {
        await updateArticuloMenu(id, articuloData);
        toast.success('Artículo actualizado correctamente');
      } else {
        await createArticuloMenu(articuloData);
        toast.success('Artículo creado correctamente');
      }
      
      navigate(`/menu/${isEditing ? articulo.restaurante_id : restauranteId}`);
    } catch (err) {
      setError('Error al guardar el artículo');
      toast.error('Error al guardar el artículo');
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
          {isEditing ? 'Editar Artículo' : 'Nuevo Artículo'}
        </h1>
      </div>

      {restaurante && (
        <div className="mb-6">
          <Card className="bg-gray-50">
            <p className="text-gray-600">
              Restaurante: <span className="font-medium">{restaurante.nombre}</span>
            </p>
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
            <h2 className="text-xl font-semibold mb-4">Información básica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
                  Precio (€) *
                </label>
                <input
                  id="precio"
                  type="number"
                  step="0.01"
                  min="0"
                  className={`input-field ${errors.precio ? 'border-red-500' : ''}`}
                  {...register('precio', { required: 'El precio es obligatorio' })}
                />
                {errors.precio && (
                  <p className="mt-1 text-sm text-red-600">{errors.precio.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría *
                </label>
                <select
                  id="categoria"
                  className={`input-field ${errors.categoria ? 'border-red-500' : ''}`}
                  {...register('categoria', { required: 'La categoría es obligatoria' })}
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="Entrada">Entrada</option>
                  <option value="Plato Principal">Plato Principal</option>
                  <option value="Postre">Postre</option>
                  <option value="Bebida">Bebida</option>
                  <option value="Acompañamiento">Acompañamiento</option>
                  <option value="Especial">Especial</option>
                </select>
                {errors.categoria && (
                  <p className="mt-1 text-sm text-red-600">{errors.categoria.message}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <input
                    id="disponible"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    {...register('disponible')}
                  />
                  <label htmlFor="disponible" className="ml-2 block text-sm text-gray-700">
                    Disponible
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="especialDelDia"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    {...register('especialDelDia')}
                  />
                  <label htmlFor="especialDelDia" className="ml-2 block text-sm text-gray-700">
                    Especial del día
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="descripcion"
              rows="3"
              className="input-field"
              {...register('descripcion')}
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Ingredientes y detalles</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="ingredientes" className="block text-sm font-medium text-gray-700 mb-1">
                  Ingredientes (separados por comas)
                </label>
                <input
                  id="ingredientes"
                  type="text"
                  className="input-field"
                  placeholder="Tomate, Queso, Albahaca..."
                  {...register('ingredientes')}
                />
              </div>
              
              <div>
                <label htmlFor="alergenos" className="block text-sm font-medium text-gray-700 mb-1">
                  Alérgenos (separados por comas)
                </label>
                <input
                  id="alergenos"
                  type="text"
                  className="input-field"
                  placeholder="Gluten, Lácteos, Huevo..."
                  {...register('alergenos')}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Ej: Gluten, Crustáceos, Huevos, Pescado, Cacahuetes, Soja, Lácteos, Frutos secos...
                </p>
              </div>
              
              <div>
                <label htmlFor="aptoPara" className="block text-sm font-medium text-gray-700 mb-1">
                  Apto para (separados por comas)
                </label>
                <input
                  id="aptoPara"
                  type="text"
                  className="input-field"
                  placeholder="Vegetariano, Vegano, Sin Gluten..."
                  {...register('aptoPara')}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Ej: Vegetariano, Vegano, Sin Gluten, Sin Lactosa, Bajo en Calorías...
                </p>
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
              {isEditing ? 'Actualizar' : 'Crear'} Artículo
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ArticuloFormPage;