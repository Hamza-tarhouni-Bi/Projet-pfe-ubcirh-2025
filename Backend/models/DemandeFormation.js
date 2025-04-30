const mongoose = require('mongoose');

const DemandeFormationSchema = new mongoose.Schema({
  nom: {
    type: String,
    //required: [true, 'Le nom est obligatoire'],
    trim: true
  },
  prenom: {
    type: String,
   // required: [true, 'Le prénom est obligatoire'],
    trim: true
  },
  email:{
    type:String,
   // required:true
  },
  nomFormation: {
    type: String,
   // required: [true, 'Le nom de la formation est obligatoire'],
    trim: true
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
  timestamps: true // ✅ ici la virgule est bien fermée
});

// ✅ Export correct
module.exports = mongoose.model('DemandeFormation', DemandeFormationSchema);
