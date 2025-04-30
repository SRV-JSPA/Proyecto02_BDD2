const mongoose = require('mongoose');

const direccionSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    enum: ['Casa', 'Trabajo', 'Otro']
  },
  calle: {
    type: String,
    required: true
  },
  ciudad: {
    type: String,
    required: true
  },
  codigoPostal: String,
  ubicacion: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], 
      required: true
    }
  },
  predeterminada: {
    type: Boolean,
    default: false
  }
});

const metodoPagoSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true,
    enum: ['Tarjeta', 'PayPal', 'Efectivo', 'Otro']
  },
  ultimosDigitos: {
    type: String,
    validate: {
      validator: function(v) {
        if (this.tipo === 'Tarjeta') {
          return /^\d{4}$/.test(v);
        }
        return true; 
      },
      message: props => 'Últimos dígitos debe ser un número de 4 dígitos para tarjetas'
    }
  },
  predeterminado: {
    type: Boolean,
    default: false
  },
  fechaExpiracion: String, 
});

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Ingrese un email válido']
  },
  telefono: {
    type: String,
    trim: true
  },
  direcciones: [direccionSchema],
  metodosPago: [metodoPagoSchema],
  preferencias: {
    dietasEspeciales: [String],
    restaurantesFavoritos: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurante'
    }]
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  ultimoAcceso: {
    type: Date,
    default: Date.now
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

usuarioSchema.index({ email: 1 }, { unique: true });
usuarioSchema.index({ nombre: 1, apellido: 1 });
usuarioSchema.index({ 'direcciones.ubicacion': '2dsphere' });
usuarioSchema.index({ 'preferencias.restaurantesFavoritos': 1 });

usuarioSchema.pre('save', function(next) {
  if (this.isModified('direcciones')) {
    const predeterminadas = this.direcciones.filter(dir => dir.predeterminada);
    if (predeterminadas.length > 1) {
      for (let i = 0; i < predeterminadas.length - 1; i++) {
        const index = this.direcciones.indexOf(predeterminadas[i]);
        this.direcciones[index].predeterminada = false;
      }
    }
  }

  if (this.isModified('metodosPago')) {
    const predeterminados = this.metodosPago.filter(mp => mp.predeterminado);
    if (predeterminados.length > 1) {
      for (let i = 0; i < predeterminados.length - 1; i++) {
        const index = this.metodosPago.indexOf(predeterminados[i]);
        this.metodosPago[index].predeterminado = false;
      }
    }
  }

  next();
});

module.exports = mongoose.model('Usuario', usuarioSchema);