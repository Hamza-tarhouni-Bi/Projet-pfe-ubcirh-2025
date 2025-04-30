const mongoose = require('mongoose');

const DemandeAvanceSchema = new mongoose.Schema({
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
    unique: true,
    trim: true
  },
  montant: {
    type: Number,
    required: [true, 'Le montant est obligatoire'],
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

module.exports = mongoose.model('DemandeAvance', DemandeAvanceSchema);
