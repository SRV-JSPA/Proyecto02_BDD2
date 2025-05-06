import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaUser, FaEnvelope, FaPhone, FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { updateUsuario } from '../../api/usuarios';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, updateUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      telefono: ''
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        telefono: user.telefono || ''
      });
    }
  }, [user, reset]);

  if (!user) {
    return <Loading />;
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedProfile = await updateUsuario(user._id, data);
      
      updateUserData(updatedProfile);
      
      toast.success('Perfil actualizado correctamente');
      
      setIsEditing(false);
    } catch (err) {
      setError('Error al actualizar el perfil. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset({
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      email: user.email || '',
      telefono: user.telefono || ''
    });
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Información Personal</h2>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="small"
                    icon={<FaTimes />}
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="small"
                    icon={<FaSave />}
                    onClick={handleSubmit(onSubmit)}
                    loading={loading}
                  >
                    Guardar
                  </Button>
                </div>
              )}
            </div>

            {error && (
              <ErrorMessage message={error} className="mb-4" />
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="nombre"
                      type="text"
                      className={`input-field pl-10 ${isEditing ? '' : 'bg-gray-50'} ${errors.nombre ? 'border-red-500' : ''}`}
                      disabled={!isEditing}
                      {...register('nombre', {
                        required: 'El nombre es obligatorio',
                        minLength: {
                          value: 2,
                          message: 'El nombre debe tener al menos 2 caracteres'
                        }
                      })}
                    />
                  </div>
                  {errors.nombre && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="apellido"
                      type="text"
                      className={`input-field pl-10 ${isEditing ? '' : 'bg-gray-50'} ${errors.apellido ? 'border-red-500' : ''}`}
                      disabled={!isEditing}
                      {...register('apellido', {
                        required: 'El apellido es obligatorio',
                        minLength: {
                          value: 2,
                          message: 'El apellido debe tener al menos 2 caracteres'
                        }
                      })}
                    />
                  </div>
                  {errors.apellido && (
                    <p className="mt-1 text-sm text-red-600">{errors.apellido.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      className={`input-field pl-10 ${isEditing ? '' : 'bg-gray-50'} ${errors.email ? 'border-red-500' : ''}`}
                      disabled={!isEditing}
                      {...register('email', {
                        required: 'El correo electrónico es obligatorio',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Ingresa un correo electrónico válido'
                        }
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="telefono"
                      type="tel"
                      className={`input-field pl-10 ${isEditing ? '' : 'bg-gray-50'} ${errors.telefono ? 'border-red-500' : ''}`}
                      disabled={!isEditing}
                      {...register('telefono', {
                        pattern: {
                          value: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
                          message: 'Ingresa un número de teléfono válido'
                        }
                      })}
                    />
                  </div>
                  {errors.telefono && (
                    <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="md:hidden flex space-x-2 mt-6">
                  <Button
                    variant="outline"
                    fullWidth
                    icon={<FaTimes />}
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    fullWidth
                    icon={<FaSave />}
                    loading={loading}
                  >
                    Guardar
                  </Button>
                </div>
              )}
            </form>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-6">Información de la cuenta</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Miembro desde</p>
                <p className="font-medium">
                  {user.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Último acceso</p>
                <p className="font-medium">
                  {user.ultimoAcceso ? new Date(user.ultimoAcceso).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="mb-8">
            <h2 className="text-xl font-semibold mb-6">Enlaces rápidos</h2>
            
            <nav className="space-y-2">
              <Button 
                variant="outline" 
                fullWidth 
                className="justify-start"
                onClick={() => navigate('/direcciones')}
              >
                Mis direcciones
              </Button>
              <Button 
                variant="outline" 
                fullWidth 
                className="justify-start"
                onClick={() => navigate('/metodos-pago')}
              >
                Métodos de pago
              </Button>
              <Button 
                variant="outline" 
                fullWidth 
                className="justify-start"
                onClick={() => navigate('/ordenes')}
              >
                Historial de pedidos
              </Button>
            </nav>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;