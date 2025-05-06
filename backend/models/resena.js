const mongoose = require('mongoose');

const resenaSchema = new mongoose.Schema({
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
  comentario: String,
  calificacion: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  fecha: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

resenaSchema.index({ comentario: 'text' });
resenaSchema.index({ calificacion: -1 });
resenaSchema.index({ restaurante: 1, calificacion: -1 });
resenaSchema.index({ usuario: 1, fecha: -1 });

module.exports = mongoose.model('Resena', resenaSchema);