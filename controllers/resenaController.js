const Resena = require('../models/resena');

exports.getResenas = async (req, res) => {
  try {
    const { restauranteId, usuarioId, ordenarPor = 'fecha', limite = 10, pagina = 1 } = req.query;

    let query = {};
    if (restauranteId) query.restaurante = restauranteId;
    if (usuarioId) query.usuario = usuarioId;

    let sort = {};
    if (ordenarPor === 'calificacion') {
      sort = { calificacion: -1 };
    } else {
      sort = { fecha: -1 };
    }

    const skip = (pagina - 1) * limite;

    const resenas = await Resena.find(query)
      .sort(sort)
      .limit(parseInt(limite))
      .skip(skip)
      .populate('usuario', 'nombre')
      .populate('restaurante', 'nombre');

    const total = await Resena.countDocuments(query);

    res.json({
      resenas,
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

exports.getResenaById = async (req, res) => {
  try {
    const resena = await Resena.findById(req.params.id)
      .populate('usuario', 'nombre')
      .populate('restaurante', 'nombre');

    if (!resena) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }

    res.json(resena);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.createResena = async (req, res) => {
  try {
    const nuevaResena = new Resena(req.body);
    await nuevaResena.save();
    res.status(201).json(nuevaResena);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear reseña' });
  }
};

exports.updateResena = async (req, res) => {
  try {
    const resena = await Resena.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!resena) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }

    res.json(resena);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar reseña' });
  }
};

exports.deleteResena = async (req, res) => {
  try {
    const resena = await Resena.findById(req.params.id);
    if (!resena) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }

    await resena.deleteOne();
    res.json({ mensaje: 'Reseña eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar reseña' });
  }
};

exports.buscarResenas = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Se requiere un término de búsqueda' });
    }

    const resenas = await Resena.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(10);

    res.json(resenas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en la búsqueda de reseñas' });
  }
};
