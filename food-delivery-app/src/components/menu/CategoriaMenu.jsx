import React from 'react';

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
          <div key={articulo._id} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold mb-2">{articulo.nombre}</h3>
            <p className="text-gray-600 text-sm mb-2">{articulo.descripcion}</p>
            <p className="font-bold text-primary-600">{articulo.precio?.toFixed(2) || '0.00'} €</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriaMenu;