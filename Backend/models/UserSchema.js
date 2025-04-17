const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        
    },
    prenom: {
        type: String,
      
        minLength: 3,
        maxLength: 15
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        
    },
    role: {
        type: String,
        enum: ['drh', 'personnel'],
        
    },
    age: {
        type: Number
    },
    image: {
        type: String
    }
}, { timestamps: true });


userSchema.pre("save", async function(next) {
    try {
        if (!this.isModified('password')) return next(); 
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
