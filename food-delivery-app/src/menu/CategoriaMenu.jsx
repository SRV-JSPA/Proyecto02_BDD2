import React from 'react';
import ArticuloCard from './ArticuloCard';

const CategoriaMenu = ({ titulo, articulos = [], restaurante }) => {
  if (!articulos || articulos.length === 0) {
    return null;
  }

  const mapearCategoria = (categoria) => {
    const categorias = {
      'Entrada': 'Entrantes',
      'Plato Principal': 'Platos Principales',
      'Postre': 'Postres',
      'Bebida': 'Bebidas',
      'Acompañamiento': 'Acompañamientos',
      'Especial': 'Especiales'
    };

    return categorias[categoria] || categoria;
  };

  const tituloFormateado = titulo ? mapearCategoria(titulo) : 'Menú';

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        {tituloFormateado}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articulos.map((articulo) => (
          <ArticuloCard 
            key={articulo._id} 
            articulo={articulo} 
            restaurante={restaurante} 
          />
        ))}
      </div>
    </div>
  );
};

export default CategoriaMenu;