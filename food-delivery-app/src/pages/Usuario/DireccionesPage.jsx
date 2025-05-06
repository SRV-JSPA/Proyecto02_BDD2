import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaMapMarkerAlt, FaPlus, FaPen, FaTrash, FaHome, FaBuilding } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { agregarDireccion, actualizarDireccion, eliminarDireccion } from '../../api/usuarios';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { toast } from 'react-toastify';

const DireccionesPage = () => {
  const { user, updateUserData } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [direcciones, setDirecciones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDireccion, setEditingDireccion] = useState(null);

  useEffect(() => {
    if (user && user.direcciones) {
      setDirecciones(user.direcciones);
    }
  }, [user]);

  const handleAddDireccion = () => {
    setEditingDireccion(null);
    reset({
      titulo: 'Casa',
      calle: '',
      ciudad: '',
      codigoPostal: '',
      predeterminada: false
    });
    setIsModalOpen(true);
  };

  const handleEditDireccion = (direccion) => {
    setEditingDireccion(direccion);
    reset({
      titulo: direccion.titulo,
      calle: direccion.calle,
      ciudad: direccion.ciudad,
      codigoPostal: direccion.codigoPostal || '',
      predeterminada: direccion.predeterminada
    });
    setIsModalOpen(true);
  };

  const handleDeleteDireccion = async (direccionId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta dirección?')) {
      return;
    }
    
    try {
      setLoading(true);
      await eliminarDireccion(user._id, direccionId);
      
      const updatedUser = { 
        ...user, 
        direcciones: user.direcciones.filter(d => d._id !== direccionId) 
      };
      updateUserData(updatedUser);
      
      toast.success('Dirección eliminada correctamente');
    } catch (err) {
      setError('Error al eliminar la dirección');
      toast.error('Error al eliminar la dirección');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      if (editingDireccion) {
        const response = await actualizarDireccion(user._id, editingDireccion._id, data);
        
        const updatedDirecciones = user.direcciones.map(d => 
          d._id === editingDireccion._id ? response : d
        );
        
        const updatedUser = { ...user, direcciones: updatedDirecciones };
        updateUserData(updatedUser);
        
        toast.success('Dirección actualizada correctamente');
      } else {
        const response = await agregarDireccion(user._id, data);
        
        const updatedUser = { 
          ...user, 
          direcciones: [...user.direcciones, response] 
        };
        updateUserData(updatedUser);
        
        toast.success('Dirección agregada correctamente');
      }
      
      setIsModalOpen(false);
    } catch (err) {
      setError('Error al guardar la dirección');
      toast.error('Error al guardar la dirección');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Loading />;
  }

  const renderTituloIcon = (titulo) => {
    switch(titulo) {
      case 'Casa':
        return <FaHome className="text-primary-500" />;
      case 'Trabajo':
        return <FaBuilding className="text-primary-500" />;
      default:
        return <FaMapMarkerAlt className="text-primary-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mis Direcciones</h1>

      <div className="mb-8">
        {direcciones.length === 0 ? (
          <Card className="text-center py-10">
            <p className="text-gray-500 mb-4">No tienes ninguna dirección guardada</p>
            <Button onClick={handleAddDireccion} icon={<FaPlus />}>
              Añadir dirección
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {direcciones.map((direccion) => (
              <Card key={direccion._id} className="hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">
                      {renderTituloIcon(direccion.titulo)}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium mr-2">{direccion.titulo}</h3>
                        {direccion.predeterminada && (
                          <span className="bg-primary-100 text-primary-800 text-xs py-1 px-2 rounded-full">
                            Predeterminada
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{direccion.calle}</p>
                      <p className="text-gray-600">
                        {direccion.ciudad}
                        {direccion.codigoPostal && `, ${direccion.codigoPostal}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditDireccion(direccion)}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <FaPen />
                    </button>
                    <button 
                      onClick={() => handleDeleteDireccion(direccion._id)}
                      className="text-red-600 hover:text-red-700"
                      disabled={loading}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
            
            <div className="mt-6 text-center">
              <Button onClick={handleAddDireccion} icon={<FaPlus />}>
                Añadir nueva dirección
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDireccion ? 'Editar dirección' : 'Añadir dirección'}
      >
        {error && (
          <ErrorMessage message={error} className="mb-4" />
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 mb-4">
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de dirección *
              </label>
              <select
                id="titulo"
                className={`input-field ${errors.titulo ? 'border-red-500' : ''}`}
                {...register('titulo', { required: 'El tipo de dirección es obligatorio' })}
              >
                <option value="Casa">Casa</option>
                <option value="Trabajo">Trabajo</option>
                <option value="Otro">Otro</option>
              </select>
              {errors.titulo && (
                <p className="mt-1 text-sm text-red-600">{errors.titulo.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="calle" className="block text-sm font-medium text-gray-700 mb-1">
                Calle y número *
              </label>
              <input
                id="calle"
                type="text"
                className={`input-field ${errors.calle ? 'border-red-500' : ''}`}
                placeholder="Calle, número, piso, puerta..."
                {...register('calle', { required: 'La calle es obligatoria' })}
              />
              {errors.calle && (
                <p className="mt-1 text-sm text-red-600">{errors.calle.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad *
              </label>
              <input
                id="ciudad"
                type="text"
                className={`input-field ${errors.ciudad ? 'border-red-500' : ''}`}
                {...register('ciudad', { required: 'La ciudad es obligatoria' })}
              />
              {errors.ciudad && (
                <p className="mt-1 text-sm text-red-600">{errors.ciudad.message}</p>
              )}
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
            
            <div className="flex items-center">
              <input
                id="predeterminada"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                {...register('predeterminada')}
              />
              <label htmlFor="predeterminada" className="ml-2 block text-sm text-gray-700">
                Establecer como dirección predeterminada
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
            >
              {editingDireccion ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DireccionesPage;