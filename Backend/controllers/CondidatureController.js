const condidatureModal = require("../models/CondidatureSchema");
const { sendAcceptedCandidatureEmail, sendRejectedCandidatureEmail } = require('../utiles/candidatureEmailService');

module.exports.getCondidature = async (req, res) => {
  try {
    const condidaturelist = await condidatureModal.find();
    if (!condidaturelist) {
      return res.status(404).json({ message: "There is no condidature" });
    }
    return res.status(200).json(condidaturelist);
  } catch (error) {
    console.error("Error in getCondidature:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports.addCondidature = async (req, res) => {
  try {
    // Validate required fields
    const { nom, prenom, adresse, email, tel, posteId, posteTitle } = req.body;
    
    if (!nom || !prenom || !adresse || !email || !tel) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const condidatureData = { 
      nom, 
      prenom, 
      adresse, 
      email, 
      tel,
      posteId,
      posteTitle
    };
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "CV file is required" });
    }
    
    // Add file path to data
    condidatureData.cv = req.file.filename;
    
    // Create and save new candidate
    const condidature = new condidatureModal(condidatureData);
    const condidatureadded = await condidature.save();
    
    return res.status(201).json(condidatureadded);
    
  } catch (error) {
    console.error("Error in addCondidature:", error);
    // Handle duplicate email error specifically
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(400).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: error.message });
  }
};

// Méthode mise à jour pour inclure l'envoi d'emails
module.exports.updateCondidatureStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Vérifier que le statut est valide
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    
    // Trouver la candidature avant la mise à jour pour avoir les infos complètes
    const candidature = await condidatureModal.findById(id);
    
    if (!candidature) {
      return res.status(404).json({ message: "Candidature not found" });
    }
    
    // Mise à jour du statut
    candidature.status = status;
    const updatedCandidature = await candidature.save();
    
    // Envoi d'email en fonction du nouveau statut
    try {
      if (status === 'accepted') {
        await sendAcceptedCandidatureEmail(
          candidature.email,
          candidature.nom,
          candidature.prenom,
          candidature.posteTitle || 'Non spécifié'
        );
        console.log(`Email d'acceptation envoyé à ${candidature.email}`);
      } else if (status === 'rejected') {
        await sendRejectedCandidatureEmail(
          candidature.email,
          candidature.nom,
          candidature.prenom,
          candidature.posteTitle || 'Non spécifié'
        );
        console.log(`Email de refus envoyé à ${candidature.email}`);
      }
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError);
     
    }
    
    return res.status(200).json(updatedCandidature);
    
  } catch (error) {
    console.error("Error in updateCondidatureStatus:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports.deleteCondidature = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await condidatureModal.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Candidature not found" });
    }
    
    res.status(200).json(deleted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};