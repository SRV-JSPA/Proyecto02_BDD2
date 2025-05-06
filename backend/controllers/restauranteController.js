const Restaurante = require('../models/restaurantes.js');

exports.getRestaurantes = async (req, res) => {
  try {
    const { tipoCocina, ciudad, ordenarPor, limite = 10, pagina = 1 } = req.query;
    
    let query = {};
    
    if (tipoCocina) {
      query.tiposCocina = tipoCocina;
    }
    
    if (ciudad) {
      query['direccion.ciudad'] = ciudad;
    }
    
    let sort = {};
    if (ordenarPor === 'calificacion') {
      sort = { calificacionPromedio: -1 };
    } else if (ordenarPor === 'precio') {
      sort = { precioPromedio: 1 };
    } else {
      sort = { nombre: 1 }; 
    }
    
    const skip = (pagina - 1) * limite;
    
    const restaurantes = await Restaurante.find(query)
      .sort(sort)
      .limit(parseInt(limite))
      .skip(skip)
      .select('nombre direccion.ciudad tiposCocina calificacionPromedio precioPromedio imagenes');

    const total = await Restaurante.countDocuments(query);
    
    res.json({
      restaurantes,
      paginacion: {
        total,
        pagina: parseInt(pagina),
        paginas: Math.ceil(total / limite)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};


exports.getRestauranteById = async (req, res) => {
  try {
    const restaurante = await Restaurante.findById(req.params.id);
    
    if (!restaurante) {
      return res.status(404).json({ error: 'Restaurante no encontrado' });
    }
    
    res.json(restaurante);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Restaurante no encontrado' });
    }
    res.status(500).json({ error: 'Error del servidor' });
  }
};


exports.createRestaurante = async (req, res) => {
  try {
    const nuevoRestaurante = new Restaurante(req.body);
    await nuevoRestaurante.save();
    
    res.status(201).json(nuevoRestaurante);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear restaurante' });
  }
};


exports.updateRestaurante = async (req, res) => {
  try {
    const restaurante = await Restaurante.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!restaurante) {
      return res.status(404).json({ error: 'Restaurante no encontrado' });
    }
    
    res.json(restaurante);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar restaurante' });
  }
};


exports.deleteRestaurante = async (req, res) => {
  try {
    const restaurante = await Restaurante.findById(req.params.id);
    
    if (!restaurante) {
      return res.status(404).json({ error: 'Restaurante no encontrado' });
    }
    
    await restaurante.deleteOne();
    
    res.json({ mensaje: 'Restaurante eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar restaurante' });
  }
};


exports.getRestaurantesCercanos = async (req, res) => {
  try {
    const { lng, lat, distancia = 5000 } = req.query; 
    
    if (!lng || !lat) {
      return res.status(400).json({ error: 'Se requieren coordenadas (lng, lat)' });
    }
    
    const restaurantes = await Restaurante.find({
      'direccion.ubicacion': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(distancia)
        }
      }
    }).select('nombre direccion calificacionPromedio tiposCocina');
    
    res.json(restaurantes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar restaurantes cercanos' });
  }
};


exports.buscarRestaurantes = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Se requiere un término de búsqueda' });
    }
    
    const restaurantes = await Restaurante.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(10);
    
    res.json(restaurantes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en la búsqueda' });
  }
};