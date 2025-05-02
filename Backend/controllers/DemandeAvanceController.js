const DemandeAvance = require('../models/DemandeAvanceSchema');
const { sendUpdateDemandeAvanceEmail } = require('../utiles/SendUpdateDa');

exports.addDemandeAvance = async (req, res) => {
  try {
    const { nom, prenom, email, montant, statut, type, motif } = req.body;

    // Validation des champs requis
    if (!nom || !prenom || !email || !montant || !statut || !type || !motif) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Vérification si l'email existe déjà (optionnel selon vos besoins)
    const demandeExistante = await DemandeAvance.findOne({ email });
    if (demandeExistante) {
      return res.status(400).json({ message: "Une demande avec cet email existe déjà" });
    }

    const nouvelleDemande = new DemandeAvance({
      nom,
      prenom,
      email,
      montant,
      statut,
      type,
      motif
    });

    await nouvelleDemande.save();
    res.status(201).json({ message: "Demande créée avec succès", demande: nouvelleDemande });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Erreur serveur",
      error: error.message 
    });
  }
};

exports.getDemandeAvance = async (req, res) => {
  try {
    const demandes = await DemandeAvance.find();
    if (!demandes || demandes.length === 0) {
      return res.status(404).json({ message: "Aucune demande d'avance trouvée" });
    }
    res.status(200).json(demandes);
  } catch (error) {
    res.status(500).json({ 
      message: "Erreur serveur",
      error: error.message 
    });
  }
};

exports.updateDemandeAvance = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Vérifier si la demande existe
    const demandeExistante = await DemandeAvance.findById(id);
    if (!demandeExistante) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }

    // Liste des champs autorisés à être mis à jour
    const allowedUpdates = ['statut', 'motif']; // Ajoutez d'autres champs si nécessaire
    const requestedUpdates = Object.keys(updateData);
    
    // Vérifier si tous les champs demandés sont autorisés
    const isValidOperation = requestedUpdates.every(update => allowedUpdates.includes(update));
    
    if (!isValidOperation) {
      return res.status(400).json({ message: "Mise à jour non autorisée pour un ou plusieurs champs" });
    }

    // Ajouter la date de mise à jour
    updateData.updatedAt = Date.now();

    // Mettre à jour la demande
    const updatedDemande = await DemandeAvance.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Retourner le document mis à jour
    );

    // Envoyer un email si le statut a été modifié
    if (updateData.statut && updateData.statut !== demandeExistante.statut) {
      try {
        await sendUpdateDemandeAvanceEmail(
          updatedDemande.email,
          updatedDemande.nom,
          updatedDemande.prenom,
          updatedDemande.montant,
          updatedDemande.type,
          updatedDemande.statut,
          updatedDemande.motif
        );
      } catch (emailError) {
        console.error("Erreur lors de l'envoi de l'email:", emailError);
        // Ne pas bloquer la réponse même si l'email échoue
      }
    }

    res.status(200).json({
      message: "Demande mise à jour avec succès",
      demande: updatedDemande
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Erreur serveur",
      error: error.message 
    });
  }
};

exports.deleteDemandeAvance = async (req, res) => {
  try {
    const { id } = req.params;

    const demande = await DemandeAvance.findByIdAndDelete(id);
    if (!demande) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }

    res.status(200).json({ message: "Demande supprimée avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Erreur serveur",
      error: error.message 
    });
  }
};

exports.getDemandeAvanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const demande = await DemandeAvance.findById(id);
    
    if (!demande) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }

    res.status(200).json(demande);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Erreur serveur",
      error: error.message 
    });
  }
};