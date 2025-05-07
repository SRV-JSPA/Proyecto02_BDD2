import React from 'react';
import { useRouteError, Link } from 'react-router-dom';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import Button from './Button';

const ErrorBoundary = () => {
  const error = useRouteError();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="inline-flex rounded-full bg-red-100 p-4">
          <FaExclamationTriangle className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900">
          Ha ocurrido un error
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          {error?.statusText || error?.message || 'Algo salió mal en la aplicación'}
        </p>
        <div className="mt-6">
          <Link to="/">
            <Button icon={<FaArrowLeft />}>
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;