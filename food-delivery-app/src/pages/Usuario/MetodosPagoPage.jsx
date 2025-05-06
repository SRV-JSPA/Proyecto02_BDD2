import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaCreditCard, FaPlus, FaTrash, FaCcVisa, FaCcMastercard, FaCcPaypal } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { agregarMetodoPago, eliminarMetodoPago } from '../../api/usuarios';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { toast } from 'react-toastify';

const MetodosPagoPage = () => {
  const { user, updateUserData } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metodosPago, setMetodosPago] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user && user.metodosPago) {
      setMetodosPago(user.metodosPago);
    }
  }, [user]);

  const handleAddMetodoPago = () => {
    reset({
      tipo: 'Tarjeta',
      ultimosDigitos: '',
      fechaExpiracion: '',
      predeterminado: false
    });
    setIsModalOpen(true);
  };

  const handleDeleteMetodoPago = async (metodoPagoId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este método de pago?')) {
      return;
    }
    
    try {
      setLoading(true);
      await eliminarMetodoPago(user._id, metodoPagoId);
      
      const updatedUser = { 
        ...user, 
        metodosPago: user.metodosPago.filter(mp => mp._id !== metodoPagoId) 
      };
      updateUserData(updatedUser);
      
      toast.success('Método de pago eliminado correctamente');
    } catch (err) {
      setError('Error al eliminar el método de pago');
      toast.error('Error al eliminar el método de pago');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const response = await agregarMetodoPago(user._id, data);
      
      const updatedUser = { 
        ...user, 
        metodosPago: [...user.metodosPago, response] 
      };
      updateUserData(updatedUser);
      
      toast.success('Método de pago agregado correctamente');
      
      setIsModalOpen(false);
    } catch (err) {
      setError('Error al guardar el método de pago');
      toast.error('Error al guardar el método de pago');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Loading />;
  }

  const renderTipoIcon = (tipo) => {
    switch(tipo) {
      case 'Tarjeta':
        return <FaCreditCard className="text-primary-500" />;
      case 'PayPal':
        return <FaCcPaypal className="text-primary-500" />;
      default:
        return <FaCreditCard className="text-primary-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mis Métodos de Pago</h1>

      <div className="mb-8">
        {metodosPago.length === 0 ? (
          <Card className="text-center py-10">
            <p className="text-gray-500 mb-4">No tienes ningún método de pago guardado</p>
            <Button onClick={handleAddMetodoPago} icon={<FaPlus />}>
              Añadir método de pago
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {metodosPago.map((metodoPago) => (
              <Card key={metodoPago._id} className="hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">
                      {renderTipoIcon(metodoPago.tipo)}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium mr-2">{metodoPago.tipo}</h3>
                        {metodoPago.predeterminado && (
                          <span className="bg-primary-100 text-primary-800 text-xs py-1 px-2 rounded-full">
                            Predeterminado
                          </span>
                        )}
                      </div>
                      {metodoPago.tipo === 'Tarjeta' && metodoPago.ultimosDigitos && (
                        <p className="text-gray-600">**** **** **** {metodoPago.ultimosDigitos}</p>
                      )}
                      {metodoPago.fechaExpiracion && (
                        <p className="text-gray-600">Expira: {metodoPago.fechaExpiracion}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <button 
                      onClick={() => handleDeleteMetodoPago(metodoPago._id)}
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
              <Button onClick={handleAddMetodoPago} icon={<FaPlus />}>
                Añadir nuevo método de pago
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Añadir método de pago"
      >
        {error && (
          <ErrorMessage message={error} className="mb-4" />
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 mb-4">
            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de pago *
              </label>
              <select
                id="tipo"
                className={`input-field ${errors.tipo ? 'border-red-500' : ''}`}
                {...register('tipo', { required: 'El tipo de pago es obligatorio' })}
              >
                <option value="Tarjeta">Tarjeta de crédito/débito</option>
                <option value="PayPal">PayPal</option>
                <option value="Efectivo">Efectivo</option>
              </select>
              {errors.tipo && (
                <p className="mt-1 text-sm text-red-600">{errors.tipo.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="ultimosDigitos" className="block text-sm font-medium text-gray-700 mb-1">
                Últimos 4 dígitos
              </label>
              <input
                id="ultimosDigitos"
                type="text"
                maxLength="4"
                className="input-field"
                placeholder="1234"
                {...register('ultimosDigitos', {
                  pattern: {
                    value: /^[0-9]{4}$/,
                    message: 'Ingresa los 4 últimos dígitos'
                  }
                })}
              />
              {errors.ultimosDigitos && (
                <p className="mt-1 text-sm text-red-600">{errors.ultimosDigitos.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="fechaExpiracion" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de expiración
              </label>
              <input
                id="fechaExpiracion"
                type="text"
                className="input-field"
                placeholder="MM/AA"
                {...register('fechaExpiracion', {
                  pattern: {
                    value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                    message: 'Formato válido: MM/AA'
                  }
                })}
              />
              {errors.fechaExpiracion && (
                <p className="mt-1 text-sm text-red-600">{errors.fechaExpiracion.message}</p>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                id="predeterminado"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                {...register('predeterminado')}
              />
              <label htmlFor="predeterminado" className="ml-2 block text-sm text-gray-700">
                Establecer como método predeterminado
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
              Guardar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MetodosPagoPage;