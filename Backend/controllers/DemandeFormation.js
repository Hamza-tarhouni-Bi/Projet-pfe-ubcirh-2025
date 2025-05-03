const DemandeFormation = require('../models/DemandeFormation');
const { sendUpdateDemandeFormationEmail } = require('../utiles/SendUpdateDF.js');

exports.addDemandeFormation = async (req, res) => {
  try {
    const { nom, prenom, email, nomFormation, idFormation, idUser } = req.body;
    
    if (!nom || !prenom || !email || !nomFormation || !idFormation || !idUser) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

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
      idUser
    });

    await nouvelleDemande.save();
    res.status(201).json(nouvelleDemande);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDemandeFormation = async (req, res) => {
  try {
    const demandes = await DemandeFormation.find();
    res.status(200).json(demandes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStatutDemande = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

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

    // Envoi email sans attendre la réponse
    sendUpdateDemandeFormationEmail(
      updatedDemande.email,
      updatedDemande.nom,
      updatedDemande.prenom,
      updatedDemande.nomFormation,
      statut
    ).catch(error => console.error("Erreur email:", error));

    res.status(200).json(updatedDemande);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};