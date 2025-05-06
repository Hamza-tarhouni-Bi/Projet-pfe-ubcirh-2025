const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const personnelSchema = new mongoose.Schema({
    nom: { 
        type: String,
        required: true
    },
    prenom: { 
        type: String,
    },
    tel: {
        type: Number,
        unique: true,
        max: 99999999,
    },
    email: {
        type: String,
       // unique: true
    },
    password: {
        type: String,
    },
    tempPassword: {  // Nouveau champ pour stocker temporairement le mot de passe en clair
        type: String,
        select: false  // Ne sera pas retourné dans les requêtes par défaut
    },
    passwordLastChanged: {  // Pour suivre la date du dernier changement
        type: Date,
        default: Date.now
    },
    departement: {
        type: String,
    },
    sexe: { 
        type: String,
        enum: ['homme', 'femme'],
    },
    soldedeconge: {
        type: Number,
    },
    salaire: {
        type: Number,
    },
    role: {
        type: String,
        enum: ["drh", "personnel"],
        default: "personnel",
    },
    image: {
        type: String,
        default: 'images/defaultuser.jpg'
    }
}, { timestamps: true });

// Middleware pour hacher le mot de passe et gérer le tempPassword
personnelSchema.pre("save", async function(next) {
    try {
        // Si le mot de passe est modifié
        if (this.isModified('password')) {
            // Conserver le mot de passe en clair temporairement
            this.tempPassword = this.password;
            this.passwordLastChanged = Date.now();
            
            // Hacher le mot de passe
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            
            // Planifier la suppression du mot de passe en clair après 1h
            setTimeout(async () => {
                await this.model('Personnel').updateOne(
                    { _id: this._id },
                    { $unset: { tempPassword: 1 } }
                );
            }, 3600000); // 1 heure
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Méthode pour comparer les mots de passe
personnelSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode statique pour l'authentification
personnelSchema.statics.login = async function(email, password) {
    const personnel = await this.findOne({ email }).select('+tempPassword');
    
    if (!personnel) {
        throw new Error("Email incorrect");
    }

    // Vérifier d'abord avec le mot de passe temporaire si disponible
    if (personnel.tempPassword && personnel.tempPassword === password) {
        return personnel;
    }

    // Sinon vérifier avec le mot de passe hashé
    const isMatch = await personnel.comparePassword(password);
    if (!isMatch) {
        throw new Error("Mot de passe incorrect");
    }

    return personnel;
};

const Personnel = mongoose.model("Personnel", personnelSchema);
module.exports = Personnel;