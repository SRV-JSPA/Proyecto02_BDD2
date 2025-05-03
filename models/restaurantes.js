const mongoose = require('mongoose');

const direccionSchema = new mongoose.Schema({
  calle: String,
  ciudad: String,
  codigoPostal: String,
  pais: String,
  ubicacion: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  }
});

const horarioSchema = new mongoose.Schema({
  lunes: { apertura: String, cierre: String },
  martes: { apertura: String, cierre: String },
  miercoles: { apertura: String, cierre: String },
  jueves: { apertura: String, cierre: String },
  viernes: { apertura: String, cierre: String },
  sabado: { apertura: String, cierre: String },
  domingo: { apertura: String, cierre: String }
});

const restauranteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    index: true
  },
  direccion: direccionSchema,
  telefono: String,
  email: String,
  horario: horarioSchema,
  tiposCocina: {
    type: [String],
    index: true
  },
  calificacionPromedio: {
    type: Number,
    default: 0
  },
  precioPromedio: Number,
  imagenes: [String],
  descripcion: String,
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'restaurantes'
});


restauranteSchema.index({ nombre: 1 });
restauranteSchema.index({ tiposCocina: 1, calificacionPromedio: -1 });
restauranteSchema.index({ "direccion.ubicacion": "2dsphere" });
restauranteSchema.index({ nombre: "text", descripcion: "text" });

module.exports = mongoose.model('Restaurante', restauranteSchema);