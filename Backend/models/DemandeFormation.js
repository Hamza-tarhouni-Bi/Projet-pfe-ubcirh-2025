const mongoose = require('mongoose');

const DemandeFormationSchema = new mongoose.Schema({
  nom: {
    type: String,
    trim: true
  },
  prenom: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true
  },
  nomFormation: {
    type: String,
    trim: true
  },
  idFormation: {  // Nouveau champ ajouté
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  idUser: {  // Champ utile pour le suivi
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  statut: {
    type: String,
    enum: ['En attente', 'Approuvée', 'Rejetée'],
    default: 'En attente'
  },
  dateDemande: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DemandeFormation', DemandeFormationSchema);