const mongoose = require('mongoose');
const condidatureSchema = new mongoose.Schema({
    nom: { 
        type: String,
        required: true
    },
    prenom: { 
        type: String,
        required: true
    },
    adresse: {
        type: String,
        required: true
    },
    email: { 
        type: String,
        required: true,
        unique: true
    },
    tel: {
        type: Number,
        maxLength: 8,
        required: true,
    },
    cv: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

const Condidature = mongoose.model("condidature", condidatureSchema);
module.exports = Condidature;