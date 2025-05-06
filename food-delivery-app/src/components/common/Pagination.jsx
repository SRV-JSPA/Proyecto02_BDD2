import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = ''
}) => {
  if (totalPages <= 1) return null;
  
  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    let pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  
  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center px-3 py-2 rounded-md 
          ${currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
          }`}
        aria-label="Página anterior"
      >
        <FaChevronLeft className="text-sm" />
      </button>
      
      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => handlePageChange(1)}
            className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100"
          >
            1
          </button>
          {pageNumbers[0] > 2 && (
            <span className="px-2 py-1 text-gray-500">...</span>
          )}
        </>
      )}
      
      {pageNumbers.map(page => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-3 py-1 rounded-md 
            ${page === currentPage
              ? 'bg-primary-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
            }`}
        >
          {page}
        </button>
      ))}
      
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="px-2 py-1 text-gray-500">...</span>
          )}
          <button
            onClick={() => handlePageChange(totalPages)}
            className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center px-3 py-2 rounded-md 
          ${currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
          }`}
        aria-label="Página siguiente"
      >
        <FaChevronRight className="text-sm" />
      </button>
    </div>
  );
};

export default Pagination;