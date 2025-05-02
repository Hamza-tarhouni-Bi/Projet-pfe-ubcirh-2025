const personnelModal = require('../models/PersonnelSchema');
const bcrypt = require("bcrypt");
const { sendWelcomeEmail } = require('../utiles/emailService');
const { sendUpdateEmail, sendProfileImageUpdateEmail } = require('../utiles/updatemail');


const path = require('path');
const fs = require('fs');
const Personnel = require('../models/PersonnelSchema');


const jwt = require("jsonwebtoken");



// Create JWT token
const createToken = (id) => {
  return jwt.sign({id}, 'net ubcirh secret', {expiresIn: '1d'});
};

// Handle social login successful authentication
exports.handleSocialLoginSuccess = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    
    // Create token
    const token = createToken(req.user._id);
    res.cookie('jwt_token_ubcirh', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    
    // Return user info and redirect path based on role
    const redirectPath = req.user.role.toLowerCase() === 'drh' ? '/admin' : '/employe';
    
    res.status(200).json({
      message: "Social login successful",
      personnel: req.user,
      redirectTo: redirectPath
    });
  } catch (error) {
    console.error('Social login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Liste des personnels
exports.getAllPersonnel = async (req, res) => {
  try {
    const personnellist = await personnelModal.find();
    if (!personnellist) {
      throw new Error("Personnel not found");
    }
    res.status(200).json(personnellist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un personnel par ID
exports.getPersonnelWithId = async (req, res) => {
  try {
    // Vérifier que l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const personnel = await Personnel.findById(req.params.id);
    
    if (!personnel) {
      return res.status(404).json({ message: "Personnel non trouvé" });
    }

    res.status(200).json({ data: personnel });
  } catch (error) {
    console.error("Erreur lors de la récupération du personnel:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
// Suppression d'un personnel 
exports.deletePersonnel = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await personnelModal.findByIdAndDelete(id);
    
    res.status(200).json(deleted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addPersonnelWithimage = async (req, res) => {
  try {
    const personnelData = { ...req.body };
    const rawPassword = personnelData.password; 
    
    if (req.file) {
      personnelData.image = req.file.filename;
    } else {
      personnelData.image = 'images/defaultuser.jpg';
    }
    
    const personnel = new personnelModal(personnelData);
    const personneladded = await personnel.save();
    
    try {
      await sendWelcomeEmail(
        personneladded.email,
        personneladded.nom,
        personneladded.prenom,
        rawPassword
      );
      console.log('Email de bienvenue envoyé à', personneladded.email);
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError);
    }
    
    res.status(201).json(personneladded);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update personnel - VERSION FINALE
// Modification du contrôleur updatePersonnel
exports.updatePersonnel = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Gestion spécifique de la décrémentation du solde
    if (updateData.decrementSolde !== undefined) {
      const personnel = await Personnel.findById(id);
      if (!personnel) {
        return res.status(404).json({ error: "Personnel non trouvé" });
      }

      // Vérifier que le solde ne deviendra pas négatif
      const nouveauSolde = personnel.soldedeconge - updateData.decrementSolde;
      if (nouveauSolde < 0) {
        return res.status(400).json({ 
          error: "Solde de congé insuffisant" 
        });
      }

      // Mettre à jour seulement le solde
      personnel.soldedeconge = nouveauSolde;
      await personnel.save();

      // Ne pas renvoyer le mot de passe
      const responseData = personnel.toObject();
      delete responseData.password;
      
      return res.status(200).json(responseData);
    }

    // Mise à jour normale pour les autres champs
    const updatedPersonnel = await Personnel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    const responseData = updatedPersonnel.toObject();
    delete responseData.password;
    
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Erreur dans updatePersonnel:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const personnel = await personnelModal.login(email, password);
    const connecte = true;
    
    await personnelModal.findByIdAndUpdate(personnel._id, {
      $set: { connecte }
    });
    
    const token = createToken(personnel._id);
    res.cookie('jwt_token_ubcirh', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    res.status(200).json({
      message: "connected",
      personnel: {
        _id: personnel._id,
        email: personnel.email,
        nom: personnel.nom,
        prenom: personnel.prenom,
        tel: personnel.tel,
        role: personnel.role,
        password:personnel.password,
        salaire:personnel.salaire,
        soldedeconge:personnel.soldedeconge,
        
       
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.logout = async (req, res) => {
  try {
    const id = req.personnel._id;  // 👈 PROBLÈME ici !
    
    const connecte = false;
    await personnelModal.findByIdAndUpdate(id, { 
      $set: { connecte }
    });
    
    res.cookie("jwt_token_ubcirh", "", {httpOnly: false, maxAge: 1});
    res.status(200).json("User successfully logged out");
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};