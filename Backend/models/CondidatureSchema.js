const mongoose = require('mongoose');

const condidatureSchema = new mongoose.Schema({
    nom: { 
        type: String,
        required: [true, 'Le nom est obligatoire'],
        trim: true,
        maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
    },
    prenom: { 
        type: String,
        required: [true, 'Le prénom est obligatoire'],
        trim: true,
        maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères']
    },
    adresse: {
        type: String,
        required: [true, 'L\'adresse est obligatoire'],
        trim: true
    },
    email: { 
        type: String,
        required: [true, 'L\'email est obligatoire'],
        // Supprimez la ligne 'unique: true'
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} n'est pas un email valide!`
        }
    },
    tel: {
        type: String,
        required: [true, 'Le téléphone est obligatoire'],
        validate: {
            validator: function(v) {
                return /^[0-9]{8}$/.test(v);
            },
            message: props => `${props.value} n'est pas un numéro de téléphone valide! Doit contenir 8 chiffres.`
        }
    },
    cv: {
        type: String,
        required: [true, 'Le CV est obligatoire']
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'accepted', 'rejected'],
            message: 'Le statut doit être pending, accepted ou rejected'
        },
        default: 'pending'
    },
    posteId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Offre', 
        required: [true, 'L\'ID du poste est obligatoire'] 
    },
    posteTitle: { 
        type: String, 
        required: [true, 'Le titre du poste est obligatoire'],
        trim: true 
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for better query performance
condidatureSchema.index({ email: 1 });
condidatureSchema.index({ status: 1 });
condidatureSchema.index({ posteId: 1 });

const Condidature = mongoose.model('Condidature', condidatureSchema);
module.exports = Condidature;