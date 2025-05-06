const Usuario = require('../models/usuario');
const mongoose = require('mongoose');

exports.getUsuarios = async (req, res) => {
  try {
    const { nombre, email, ciudad, limite = 10, pagina = 1, ordenarPor = 'nombre' } = req.query;
    
    let query = {};
    
    if (nombre) {
      const regex = new RegExp(nombre, 'i'); 
      query.$or = [
        { nombre: regex },
        { apellido: regex }
      ];
    }
    
    if (email) {
      query.email = new RegExp(email, 'i');
    }
    
    if (ciudad) {
      query['direcciones.ciudad'] = new RegExp(ciudad, 'i');
    }
    
    let sort = {};
    if (ordenarPor === 'fechaRegistro') {
      sort = { fechaRegistro: -1 };
    } else if (ordenarPor === 'ultimoAcceso') {
      sort = { ultimoAcceso: -1 };
    } else {
      sort = { nombre: 1, apellido: 1 };
    }
    
    const skip = (parseInt(pagina) - 1) * parseInt(limite);
    
    const usuarios = await Usuario.find(query)
      .sort(sort)
      .limit(parseInt(limite))
      .skip(skip)
      .select('-metodosPago.ultimosDigitos -metodosPago.fechaExpiracion');

    const total = await Usuario.countDocuments(query);
    
    res.json({
      usuarios,
      paginacion: {
        total,
        pagina: parseInt(pagina),
        paginas: Math.ceil(total / parseInt(limite))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor al obtener usuarios' });
  }
};

exports.getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id)
      .select('-metodosPago.ultimosDigitos -metodosPago.fechaExpiracion')
      .populate('preferencias.restaurantesFavoritos', 'nombre direccion.ciudad calificacionPromedio');
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(usuario);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.createUsuario = async (req, res) => {
  try {
    const existeUsuario = await Usuario.findOne({ email: req.body.email });
    if (existeUsuario) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    
    const usuarioResponse = nuevoUsuario.toObject();
    if (usuarioResponse.metodosPago) {
      usuarioResponse.metodosPago.forEach(metodo => {
        delete metodo.ultimosDigitos;
        delete metodo.fechaExpiracion;
      });
    }
    
    res.status(201).json(usuarioResponse);
  } catch (error) {
    console.error(error);
    
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errores });
    }
    
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

exports.updateUsuario = async (req, res) => {
  try {
    if (req.body.email) {
      const existeEmail = await Usuario.findOne({ 
        email: req.body.email,
        _id: { $ne: req.params.id }  
      });
      
      if (existeEmail) {
        return res.status(400).json({ error: 'El email ya está en uso' });
      }
    }
    
    if (req.body.ultimoAcceso) {
      req.body.ultimoAcceso = new Date();
    }
    
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-metodosPago.ultimosDigitos -metodosPago.fechaExpiracion');
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(usuario);
  } catch (error) {
    console.error(error);
    
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errores });
    }
    
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

exports.deleteUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    usuario.activo = false;
    await usuario.save();
    
    
    res.json({ mensaje: 'Usuario desactivado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

exports.agregarDireccion = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    if (req.body.predeterminada) {
      usuario.direcciones.forEach(dir => {
        dir.predeterminada = false;
      });
    }
    
    usuario.direcciones.push(req.body);
    await usuario.save();
    
    res.status(201).json(usuario.direcciones[usuario.direcciones.length - 1]);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error al agregar dirección' });
  }
};

exports.actualizarDireccion = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.usuarioId);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    const direccion = usuario.direcciones.id(req.params.direccionId);
    
    if (!direccion) {
      return res.status(404).json({ error: 'Dirección no encontrada' });
    }
    
    if (req.body.predeterminada && !direccion.predeterminada) {
      usuario.direcciones.forEach(dir => {
        dir.predeterminada = false;
      });
    }
    
    Object.keys(req.body).forEach(key => {
      direccion[key] = req.body[key];
    });
    
    await usuario.save();
    
    res.json(direccion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar dirección' });
  }
};

exports.eliminarDireccion = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.usuarioId);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    const direccion = usuario.direcciones.id(req.params.direccionId);
    
    if (!direccion) {
      return res.status(404).json({ error: 'Dirección no encontrada' });
    }
    
    const eraPredeterminada = direccion.predeterminada;
    
    direccion.remove();
    
    if (eraPredeterminada && usuario.direcciones.length > 0) {
      usuario.direcciones[0].predeterminada = true;
    }
    
    await usuario.save();
    
    res.json({ mensaje: 'Dirección eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar dirección' });
  }
};

exports.agregarMetodoPago = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    if (req.body.predeterminado) {
      usuario.metodosPago.forEach(metodo => {
        metodo.predeterminado = false;
      });
    }
    
    usuario.metodosPago.push(req.body);
    await usuario.save();
    
    const metodoPago = usuario.metodosPago[usuario.metodosPago.length - 1].toObject();
    delete metodoPago.ultimosDigitos;
    delete metodoPago.fechaExpiracion;
    
    res.status(201).json(metodoPago);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error al agregar método de pago' });
  }
};

exports.eliminarMetodoPago = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.usuarioId);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    const metodoPago = usuario.metodosPago.id(req.params.metodoPagoId);
    
    if (!metodoPago) {
      return res.status(404).json({ error: 'Método de pago no encontrado' });
    }
    
    const eraPredeterminado = metodoPago.predeterminado;
    
    metodoPago.remove();
    
    if (eraPredeterminado && usuario.metodosPago.length > 0) {
      usuario.metodosPago[0].predeterminado = true;
    }
    
    await usuario.save();
    
    res.json({ mensaje: 'Método de pago eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar método de pago' });
  }
};

exports.agregarRestauranteFavorito = async (req, res) => {
  try {
    const { restauranteId } = req.body;
    
    if (!restauranteId || !mongoose.Types.ObjectId.isValid(restauranteId)) {
      return res.status(400).json({ error: 'ID de restaurante inválido' });
    }
    
    const usuario = await Usuario.findById(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    if (usuario.preferencias.restaurantesFavoritos.includes(restauranteId)) {
      return res.status(400).json({ error: 'El restaurante ya está en favoritos' });
    }
    
    usuario.preferencias.restaurantesFavoritos.push(restauranteId);
    await usuario.save();
    
    const usuarioActualizado = await Usuario.findById(req.params.id)
      .populate('preferencias.restaurantesFavoritos', 'nombre direccion.ciudad calificacionPromedio');
    
    res.json(usuarioActualizado.preferencias.restaurantesFavoritos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar restaurante favorito' });
  }
};

exports.eliminarRestauranteFavorito = async (req, res) => {
  try {
    const { restauranteId } = req.params;
    
    const usuario = await Usuario.findById(req.params.usuarioId);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    usuario.preferencias.restaurantesFavoritos = usuario.preferencias.restaurantesFavoritos
      .filter(id => id.toString() !== restauranteId);
    
    await usuario.save();
    
    const usuarioActualizado = await Usuario.findById(req.params.usuarioId)
      .populate('preferencias.restaurantesFavoritos', 'nombre direccion.ciudad calificacionPromedio');
    
    res.json(usuarioActualizado.preferencias.restaurantesFavoritos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar restaurante favorito' });
  }
};

exports.getUsuariosCercanos = async (req, res) => {
  try {
    const { lng, lat, distancia = 5000 } = req.query; 
    
    if (!lng || !lat) {
      return res.status(400).json({ error: 'Se requieren coordenadas (lng, lat)' });
    }
    
    const usuarios = await Usuario.find({
      'direcciones.ubicacion': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(distancia)
        }
      }
    }).select('nombre apellido email direcciones');
    
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar usuarios cercanos' });
  }
};
exports.buscarUsuarios = async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({ error: 'Se requiere un término de búsqueda' });
      }
      
      const usuarios = await Usuario.find(
        { $text: { $search: q } },
        { score: { $meta: 'textScore' } }
      )
      .sort({ score: { $meta: 'textScore' } })
      .limit(10)
      .select('-metodosPago.ultimosDigitos -metodosPago.fechaExpiracion');
      
      res.json(usuarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error en la búsqueda' });
    }
  };