const personnelModal = require('../models/PersonnelSchema');
const bcrypt = require("bcrypt");
const { sendWelcomeEmail } = require('../utiles/emailService');
const { sendUpdateEmail, sendProfileImageUpdateEmail } = require('../utiles/updatemail');
const path = require('path');
const fs = require('fs');
const Personnel = require('../models/PersonnelSchema');




//Liste des personnels
module.exports.getAllPersonnel = async (req, res) => {
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

//Suppression d un personnel 
module.exports.deletePersonnel = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await personnelModal.findByIdAndDelete(id);
    
    res.status(200).json(deleted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.addPersonnelWithimage = async (req, res) => {
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

//update personnel - VERSION FINALE (mêmes routes)
module.exports.updatePersonnel = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Trouver le personnel avant la mise à jour
    const personnelBeforeUpdate = await personnelModal.findById(id);
    if (!personnelBeforeUpdate) {
      return res.status(404).json({ error: "Personnel non trouvé" });
    }
    
    // Gestion de l'image
    let imageUpdated = false;
    if (req.file) {
      updateData.image = req.file.filename;
      imageUpdated = true;
      
      // Envoyer l'email pour la mise à jour de l'image IMMÉDIATEMENT
      try {
        await sendProfileImageUpdateEmail(
          personnelBeforeUpdate.email,
          personnelBeforeUpdate.nom,
          personnelBeforeUpdate.prenom
        );
        console.log('Email pour mise à jour image envoyé avec succès');
      } catch (emailError) {
        console.error("Erreur d'envoi email image:", emailError);
      }
    }

    // Détection des champs modifiés (sauf image)
    const changedFields = {};
    Object.keys(updateData).forEach(key => {
      if (key !== 'image' && personnelBeforeUpdate[key] !== updateData[key]) {
        changedFields[key] = updateData[key];
      }
    });

    // Mise à jour dans la base de données
    const updatedPersonnel = await personnelModal.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    // Envoyer l'email pour les autres champs modifiés (sauf si seul l'image a changé)
    if (Object.keys(changedFields).length > 0) {
      try {
        await sendUpdateEmail(
          updatedPersonnel.email,
          updatedPersonnel.nom,
          updatedPersonnel.prenom,
          changedFields
        );
        console.log('Email pour champs modifiés envoyé avec succès');
      } catch (emailError) {
        console.error("Erreur d'envoi email champs:", emailError);
      }
    }
  
    res.status(200).json(updatedPersonnel);
  } catch (error) {
    console.error('Erreur dans updatePersonnel:', error);
    res.status(500).json({ error: error.message });
  }
};
const jwt=require("jsonwebtoken");

const createToken =(id)=>{
  return jwt.sign({id},'net ubcirh secret',{expiresIn:'1m'})
}
















module.exports.login=async(req,res)=>{
      try {
         const {email ,password}=req.body
         const personnel = await personnelModal.login(email, password);
         const connecte = true
         await personnelModal.findByIdAndUpdate(personnel._id,{
          $set: {connecte}
      })
      const token=createToken(personnel._id);
      res.cookie('jwt_token_ubcirh',token,{httpOnly:true,maxAge:60*1000 })

      res.status(200).json({message :"connected",personnel : personnel})
      } catch (error) {
        res.status(500).json({message:error.message})
         
      }
   }

   module.exports.logout = async (req, res) => {
    try {
      const id  = req.personnel._id;
      
      const connecte = false;
      await personnelModal.findByIdAndUpdate(id, { 
        $set: { connecte }
      });
      res.cookie("jwt_token_ubcirh","",{httpOnly:false,maxAge:1})
      res.status(200).json("User successfully logged out");
    } catch (error) {
      res.status(500).json({message:error.message});
    }
  }