const DemandeConge = require('../models/DemandeCongeSchema');
const { sendUpdateDemandeCongeEmail } = require('../utiles/SendUpdateDc');

exports.addDemandeConge = async (req, res) => {
  try {
    const { idpersonnel, nom, prenom, email, DateDebut, DateFin, statut, motif } = req.body;

    // Validation des champs requis
    if (!idpersonnel || !nom || !prenom || !email || !DateDebut || !DateFin || !motif || !statut) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Vérification s'il y a déjà une demande EN ATTENTE pour cet employé
    const demandeEnAttente = await DemandeConge.findOne({ 
      idpersonnel,
      statut: "En attente" 
    });
    
    if (demandeEnAttente) {
      return res.status(400).json({ 
        message: "Vous avez déjà une demande de congé en attente" 
      });
    }

    const nouvelleDemande = new DemandeConge({
      idpersonnel,
      nom, 
      prenom, 
      email,
      DateDebut,
      DateFin,
      motif,
      statut
    });

    await nouvelleDemande.save();
    res.status(201).json({ 
      message: "Demande de congé créée avec succès",
      demande: nouvelleDemande
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Erreur serveur",
      error: error.message 
    });
  }
};

module.exports.getDemandeConge = async (req, res) => {
    try {
      const formationlist = await DemandeConge.find();
      if (!formationlist  ) {
        throw new Error("There is no avance demande");
      }
      res.status(200).json(formationlist);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.updateDemandeConge = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
  
      // Vérifier si la demande existe
      const demandeExistante = await DemandeConge.findById(id);
      if (!demandeExistante) {
        return res.status(404).json({ message: "Demande non trouvée" });
      }
  
      // Liste des champs autorisés à être mis à jour
      const allowedUpdates = [ 'DateDebut', 'DateFin', 'statut', 'motif'];
      const requestedUpdates = Object.keys(updateData);
      
      // Vérifier si tous les champs demandés sont autorisés
      const isValidOperation = requestedUpdates.every(update => allowedUpdates.includes(update));
      
      if (!isValidOperation) {
        return res.status(400).json({ message: "Mise à jour non autorisée pour un ou plusieurs champs" });
      }
  
      // Ajouter la date de mise à jour
      updateData.updatedAt = Date.now();
  
      // Mettre à jour seulement les champs fournis
      const updatedDemande = await DemandeConge.findByIdAndUpdate(
        id,
        updateData,
        { new: true } // Retourner le document mis à jour
      );
  
      // Envoyer un email si le statut a été modifié
      if (updateData.statut && updateData.statut !== demandeExistante.statut) {
        try {
          await sendUpdateDemandeCongeEmail(
            updatedDemande.email,
            updatedDemande.nom,
            updatedDemande.prenom,
            updatedDemande.DateDebut,
            updatedDemande.DateFin,
            updatedDemande.statut,
            updatedDemande.motif // Ajout du motif pour les demandes rejetées
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
