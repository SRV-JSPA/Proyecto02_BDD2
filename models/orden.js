const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  articulo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ArticuloMenu',
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  }
});

const ordenSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  restaurante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurante',
    required: true
  },
  items: [itemSchema],
  estado: {
    type: String,
    enum: ['pendiente', 'preparando', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  total: Number,
  fecha: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

ordenSchema.index({ usuario: 1, fecha: -1 });
ordenSchema.index({ restaurante: 1 });
ordenSchema.index({ estado: 1 });


module.exports = mongoose.model('Orden', ordenSchema);
