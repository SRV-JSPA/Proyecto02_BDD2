const Orden = require('../models/orden');

exports.getOrdenes = async (req, res) => {
  try {
    const { usuarioId, restauranteId, estado, ordenarPor = 'fecha', limite = 10, pagina = 1 } = req.query;

    let query = {};
    if (usuarioId) query.usuario = usuarioId;
    if (restauranteId) query.restaurante = restauranteId;
    if (estado) query.estado = estado;

    let sort = {};
    if (ordenarPor === 'total') {
      sort = { total: -1 };
    } else {
      sort = { fecha: -1 };
    }

    const skip = (pagina - 1) * limite;

    const ordenes = await Orden.find(query)
      .sort(sort)
      .limit(parseInt(limite))
      .skip(skip)
      .populate('usuario', 'nombre')
      .populate('restaurante', 'nombre')
      .populate('items.articulo', 'nombre precio');

    const total = await Orden.countDocuments(query);

    res.json({
      ordenes,
      paginacion: {
        total,
        pagina: parseInt(pagina),
        paginas: Math.ceil(total / limite)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
};

exports.getOrdenById = async (req, res) => {
  try {
    const orden = await Orden.findById(req.params.id)
      .populate('usuario', 'nombre')
      .populate('restaurante', 'nombre')
      .populate('items.articulo', 'nombre precio');

    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.json(orden);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar orden' });
  }
};

exports.createOrden = async (req, res) => {
  try {
    const nuevaOrden = new Orden(req.body);
    await nuevaOrden.save();
    res.status(201).json(nuevaOrden);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear orden' });
  }
};

exports.updateOrden = async (req, res) => {
  try {
    const orden = await Orden.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.json(orden);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar orden' });
  }
};

exports.deleteOrden = async (req, res) => {
  try {
    const orden = await Orden.findById(req.params.id);
    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    await orden.remove();
    res.json({ mensaje: 'Orden eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar orden' });
  }
};
