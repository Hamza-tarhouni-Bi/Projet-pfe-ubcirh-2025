const DemandeFormation = require('../models/DemandeFormation');

exports.addDemandeFormation = async (req, res) => {
  try {
    const { nom, prenom, email, nomFormation, idFormation, idUser } = req.body;
    
    // Validation
    if (!nom || !prenom || !email || !nomFormation || !idFormation || !idUser) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Vérifier si l'utilisateur a déjà une demande en attente pour cette formation
    const demandeExistante = await DemandeFormation.findOne({ 
      idUser: idUser,
      idFormation: idFormation,
      statut: 'En attente'
    });

    if (demandeExistante) {
      return res.status(400).json({ 
        message: "Vous avez déjà une demande en attente pour cette formation" 
      });
    }

    const nouvelleDemande = new DemandeFormation({
      nom,
      prenom,
      email,
      nomFormation,
      idFormation,
      idUser,
      statut: 'En attente'
    });

    await nouvelleDemande.save();
    res.status(201).json({ 
      message: "Demande créée avec succès",
      demande: nouvelleDemande
    });
    
  } catch (error) {
    res.status(500).json({ 
      message: "Erreur serveur",
      error: error.message 
    });
  }
};
module.exports.getDemandeFormation = async (req, res) => {
  try {
    const formationlist = await DemandeFormation.find().populate('idFormation');
    if (!formationlist) {
      throw new Error("Il n'y a aucune demande de formation");
    }
    res.status(200).json(formationlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour le statut d'une demande de formation
exports.updateStatutDemande = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    // Validation simple
    if (!['En attente', 'Approuvée', 'Rejetée'].includes(statut)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const updatedDemande = await DemandeFormation.findByIdAndUpdate(
      id,
      { statut },
      { new: true }
    );

    if (!updatedDemande) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }

    res.status(200).json({
      message: "Statut mis à jour avec succès",
      demande: updatedDemande
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message
    });
  }
};

