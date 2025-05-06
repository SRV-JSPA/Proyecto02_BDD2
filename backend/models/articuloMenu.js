const mongoose = require('mongoose');

const articuloMenuSchema = new mongoose.Schema({
  restaurante_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurante',
    required: [true, 'El restaurante es obligatorio']
  },
  nombre: {
    type: String,
    required: [true, 'El nombre del artículo es obligatorio'],
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: {
      values: ['Entrada', 'Plato Principal', 'Postre', 'Bebida', 'Acompañamiento', 'Especial'],
      message: '{VALUE} no es una categoría válida'
    }
  },
  ingredientes: [{
    type: String,
    trim: true
  }],
  alergenos: [{
    type: String,
    enum: {
      values: [
        'Gluten', 'Crustáceos', 'Huevos', 'Pescado', 'Cacahuetes', 
        'Soja', 'Lácteos', 'Frutos secos', 'Apio', 'Mostaza', 
        'Sésamo', 'Sulfitos', 'Altramuces', 'Moluscos'
      ],
      message: '{VALUE} no es un alérgeno reconocido'
    }
  }],
  aptoPara: [{
    type: String,
    enum: {
      values: [
        'Vegetariano', 'Vegano', 'Sin Gluten', 'Sin Lactosa', 
        'Bajo en Calorías', 'Sin Azúcar', 'Keto', 'Paleo'
      ],
      message: '{VALUE} no es una opción de dieta válida'
    }
  }],
  imagen: {
    type: String, 
    default: '/default-food-image.jpg'
  },
  popularidad: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  disponible: {
    type: Boolean,
    default: true
  },
  especialDelDia: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: {
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
  }
});

articuloMenuSchema.index({ nombre: 1 });
articuloMenuSchema.index({ restaurante_id: 1, categoria: 1 });
articuloMenuSchema.index({ ingredientes: 1 });
articuloMenuSchema.index({ nombre: 'text', descripcion: 'text' });

articuloMenuSchema.virtual('esAptoPara').get(function(dieta) {
  return this.aptoPara.includes(dieta);
});

articuloMenuSchema.methods.actualizarPopularidad = async function(incremento) {
  this.popularidad = Math.max(0, Math.min(100, this.popularidad + incremento));
  return this.save();
};

articuloMenuSchema.pre('save', function(next) {
  if (this.isModified('ingredientes') && this.ingredientes.length > 0) {
    this.ingredientes = [...new Set(this.ingredientes)];
  }
  
  if (this.isModified('alergenos') && this.alergenos.length > 0) {
    this.alergenos = [...new Set(this.alergenos)];
  }
  
  if (this.isModified('aptoPara') && this.aptoPara.length > 0) {
    this.aptoPara = [...new Set(this.aptoPara)];
  }
  
  next();
});

module.exports = mongoose.model('ArticuloMenu', articuloMenuSchema);