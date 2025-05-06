const condidatureModel = require("../models/CondidatureSchema");
const { sendAcceptedCandidatureEmail, sendRejectedCandidatureEmail } = require('../utiles/candidatureEmailService');

module.exports.getCondidature = async (req, res) => {
  try {
    const condidaturelist = await condidatureModel.find();
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
    // Debug: Afficher le contenu de req.body et req.file
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    // Vérification des champs requis avec des messages plus précis
    if (!req.body.email) {
      return res.status(400).json({
        success: false,
        message: "Le champ email est requis."
      });
    }

    if (!req.body.posteId) {
      return res.status(400).json({
        success: false,
        message: "L'ID du poste est requis."
      });
    }

    const { email, posteId, ...otherData } = req.body;

    // Vérification de l'existence d'une candidature
    const existingApplication = await condidatureModel.findOne({
      email: email.toString().toLowerCase().trim(),
      posteId: posteId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "Vous avez déjà postulé à cette offre."
      });
    }

    // Création de la nouvelle candidature
    const newCandidature = new condidatureModel({
      ...otherData,
      email: email.toString().toLowerCase().trim(),
      posteId: posteId,
      cv: req.file?.filename || null,
      status: 'pending'
    });

    await newCandidature.save();

    return res.status(201).json({
      success: true,
      message: "Candidature enregistrée avec succès!"
    });

  } catch (error) {
    console.error("Erreur serveur:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur. Veuillez réessayer plus tard.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports.updateCondidatureStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    
    const candidature = await condidatureModel.findById(id);
    
    if (!candidature) {
      return res.status(404).json({ message: "Candidature not found" });
    }
    
    candidature.status = status;
    const updatedCandidature = await candidature.save();
    
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
    const deleted = await condidatureModel.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Candidature not found" });
    }
    
    res.status(200).json(deleted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};