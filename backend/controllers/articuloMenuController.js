const ArticuloMenu = require('../models/articuloMenu');
const mongoose = require('mongoose');

exports.getArticulos = async (req, res) => {
  try {
    const { 
      restaurante, 
      categoria, 
      disponible, 
      especialDelDia, 
      ingrediente,
      alergeno,
      dieta,
      precioMin,
      precioMax,
      ordenarPor = 'nombre',
      direccion = 'asc',
      limite = 10, 
      pagina = 1
    } = req.query;
    
    let query = {};
    
    if (restaurante) {
      query.restaurante_id = mongoose.Types.ObjectId.isValid(restaurante) ? 
        restaurante : null;
    }
    
    if (categoria) {
      query.categoria = new RegExp(categoria, 'i');
    }
    
    if (disponible !== undefined) {
      query.disponible = disponible === 'true';
    }
    
    if (especialDelDia !== undefined) {
      query.especialDelDia = especialDelDia === 'true';
    }
    
    if (ingrediente) {
      query.ingredientes = { $regex: new RegExp(ingrediente, 'i') };
    }
    
    if (alergeno) {
      query.alergenos = { $ne: alergeno }; 
    }
    
    if (dieta) {
      query.aptoPara = dieta;
    }
    
    if (precioMin !== undefined || precioMax !== undefined) {
      query.precio = {};
      
      if (precioMin !== undefined) {
        query.precio.$gte = parseFloat(precioMin);
      }
      
      if (precioMax !== undefined) {
        query.precio.$lte = parseFloat(precioMax);
      }
    }
    
    let sort = {};
    if (ordenarPor === 'precio') {
      sort.precio = direccion === 'desc' ? -1 : 1;
    } else if (ordenarPor === 'popularidad') {
      sort.popularidad = direccion === 'desc' ? -1 : 1;
    } else if (ordenarPor === 'fechaCreacion') {
      sort.fechaCreacion = direccion === 'desc' ? -1 : 1;
    } else {
      sort.nombre = direccion === 'desc' ? -1 : 1;
    }
    
    const skip = (parseInt(pagina) - 1) * parseInt(limite);
    
    const articulos = await ArticuloMenu.find(query)
      .sort(sort)
      .limit(parseInt(limite))
      .skip(skip)
      .populate('restaurante_id', 'nombre direccion.ciudad');

    const total = await ArticuloMenu.countDocuments(query);
    
    res.json({
      articulos,
      paginacion: {
        total,
        pagina: parseInt(pagina),
        paginas: Math.ceil(total / parseInt(limite))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor al obtener artículos del menú' });
  }
};

exports.getArticuloById = async (req, res) => {
  try {
    const articulo = await ArticuloMenu.findById(req.params.id)
      .populate('restaurante_id', 'nombre direccion.ciudad tiposCocina');
    
    if (!articulo) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    
    res.json(articulo);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.createArticulo = async (req, res) => {
  try {
    const nuevoArticulo = new ArticuloMenu(req.body);
    await nuevoArticulo.save();
    
    res.status(201).json(nuevoArticulo);
  } catch (error) {
    console.error(error);
    
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errores });
    }
    
    res.status(500).json({ error: 'Error al crear artículo del menú' });
  }
};

exports.updateArticulo = async (req, res) => {
  try {
    const articulo = await ArticuloMenu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!articulo) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    
    res.json(articulo);
  } catch (error) {
    console.error(error);
    
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errores });
    }
    
    res.status(500).json({ error: 'Error al actualizar artículo del menú' });
  }
};

exports.deleteArticulo = async (req, res) => {
  try {
    const articulo = await ArticuloMenu.findById(req.params.id);
    
    if (!articulo) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    
    await ArticuloMenu.deleteOne({ _id: req.params.id });
    
    res.json({ mensaje: 'Artículo eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar artículo del menú' });
  }
};

exports.getMenuRestaurante = async (req, res) => {
  try {
    const { restauranteId } = req.params;
    const { disponibles = true } = req.query;
    
    if (!mongoose.Types.ObjectId.isValid(restauranteId)) {
      return res.status(400).json({ error: 'ID de restaurante inválido' });
    }
    
    let query = { restaurante_id: restauranteId };
    
    if (disponibles === 'true') {
      query.disponible = true;
    }
    
    const categorias = await ArticuloMenu.distinct('categoria', query);
    
    const menuPorCategoria = {};
    
    for (const categoria of categorias) {
      const articulosCategoria = await ArticuloMenu.find({
        ...query,
        categoria
      }).sort({ popularidad: -1 });
      
      menuPorCategoria[categoria] = articulosCategoria;
    }
    
    const especiales = await ArticuloMenu.find({
      ...query,
      especialDelDia: true
    });
    
    res.json({
      restauranteId,
      categorias,
      menuPorCategoria,
      especiales
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el menú del restaurante' });
  }
};

exports.cambiarDisponibilidad = async (req, res) => {
  try {
    const { disponible } = req.body;
    
    if (disponible === undefined) {
      return res.status(400).json({ error: 'Se debe especificar el estado de disponibilidad' });
    }
    
    const articulo = await ArticuloMenu.findByIdAndUpdate(
      req.params.id,
      { disponible: !!disponible },
      { new: true }
    );
    
    if (!articulo) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    
    res.json(articulo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cambiar disponibilidad' });
  }
};

exports.toggleEspecialDelDia = async (req, res) => {
  try {
    const articulo = await ArticuloMenu.findById(req.params.id);
    
    if (!articulo) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    
    articulo.especialDelDia = !articulo.especialDelDia;
    await articulo.save();
    
    res.json(articulo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cambiar estado de especial del día' });
  }
};

exports.buscarArticulos = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Se requiere un término de búsqueda' });
    }
    
    const articulos = await ArticuloMenu.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(10)
    .populate('restaurante_id', 'nombre');
    
    res.json(articulos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en la búsqueda de artículos' });
  }
};

exports.actualizarPopularidad = async (req, res) => {
  try {
    const { incremento } = req.body;
    
    if (incremento === undefined) {
      return res.status(400).json({ error: 'Se debe especificar el incremento' });
    }
    
    const articulo = await ArticuloMenu.findById(req.params.id);
    
    if (!articulo) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }
    
    await articulo.actualizarPopularidad(parseInt(incremento));
    
    res.json(articulo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar popularidad' });
  }
};

exports.bulkUpdateArticulos = async (req, res) => {
  try {
    const { operaciones } = req.body;
    
    if (!operaciones || !Array.isArray(operaciones)) {
      return res.status(400).json({ error: 'Se requiere un array de operaciones' });
    }
    
    const bulkOps = operaciones.map(op => {
      if (!mongoose.Types.ObjectId.isValid(op.id)) {
        throw new Error(`ID inválido: ${op.id}`);
      }
      
      return {
        updateOne: {
          filter: { _id: op.id },
          update: { $set: op.datos }
        }
      };
    });
    
    const resultado = await ArticuloMenu.bulkWrite(bulkOps);
    
    res.json({
      mensaje: 'Operación masiva completada',
      resultado: {
        coincidencias: resultado.matchedCount,
        modificados: resultado.modifiedCount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Error en operación masiva: ${error.message}` });
  }
};

exports.getArticulosPorIngrediente = async (req, res) => {
  try {
    const { ingrediente } = req.params;
    
    const articulos = await ArticuloMenu.find({
      ingredientes: { $regex: new RegExp(ingrediente, 'i') }
    }).populate('restaurante_id', 'nombre');
    
    res.json(articulos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar artículos por ingrediente' });
  }
};

exports.getArticulosPorDieta = async (req, res) => {
  try {
    const { dieta } = req.params;
    
    const dietas = [
      'Vegetariano', 'Vegano', 'Sin Gluten', 'Sin Lactosa', 
      'Bajo en Calorías', 'Sin Azúcar', 'Keto', 'Paleo'
    ];
    
    if (!dietas.includes(dieta)) {
      return res.status(400).json({ 
        error: 'Dieta no válida',
        dietasDisponibles: dietas
      });
    }
    
    const articulos = await ArticuloMenu.find({
      aptoPara: dieta
    }).populate('restaurante_id', 'nombre');
    
    res.json(articulos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar artículos por dieta' });
  }
};