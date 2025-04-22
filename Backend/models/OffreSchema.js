const mongoose = require('mongoose');

const offreSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  lieu: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, { timestamps: true });

const Offre = mongoose.model("Offre", offreSchema);
module.exports = Offre;
