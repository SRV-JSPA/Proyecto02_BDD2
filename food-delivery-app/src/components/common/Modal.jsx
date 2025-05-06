import React, { useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer = null,
  size = 'medium', 
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  className = '',
}) => {
  const modalRef = useRef(null);

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  const sizeClass = sizeClasses[size] || sizeClasses.medium;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && closeOnEsc) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; 
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, closeOnEsc]);

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target) && closeOnOverlayClick) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity p-4"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-lg shadow-xl overflow-hidden w-full ${sizeClass} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-800">
            {title}
          </h2>
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
              aria-label="Cerrar"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">{children}</div>

        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            {footer}
          </div>
        )}

        {!footer && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;