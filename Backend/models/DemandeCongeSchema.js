const mongoose = require('mongoose');

const DemandeCongeSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true
  },
  prenom: {
    type: String,
    required: [true, 'Le prénom est obligatoire'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est obligatoire'],
    trim: true
  },
  DateDebut: {
    type: Date,
    required: true
  },
  DateFin: {
    type: Date,
    required: true
  },
  Duree: {
    type: Number
  },
  statut: {
    type: String,
    enum: ['En attente', 'Approuvée', 'Rejetée'],
    default: 'En attente'
  },
  type: {
    type: String,
    required: [true, 'Le type est obligatoire']
  },
  motif: {
    type: String,
    required: [true, 'Le motif est obligatoire']
  }
}, {
  timestamps: true
});

// ✅ Middleware pour calculer la durée automatiquement
DemandeCongeSchema.pre('save', function (next) {
  if (this.DateDebut && this.DateFin) {
    const diffTime = this.DateFin.getTime() - this.DateDebut.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // différence en jours
    this.Duree = diffDays;
  }
  next();
});

module.exports = mongoose.model('DemandeConge', DemandeCongeSchema);
