const DemandeAvance = require('../models/DemandeAvanceSchema');

exports.addDemandeAvance = async (req, res) => {
  try {
    const { nom, prenom, email, montant,statut, type, motif } = req.body;

    // Validation simple des champs requis
    if (!nom || !prenom || !email || !montant ||!statut ||!type || !motif) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Vérification si l'email existe déjà
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
    res.status(201).json({ message: "Demande créée avec succès" });

  } catch (error) {
    console.error(error);  // Ajouter un log pour aider au débogage
    res.status(500).json({ 
      message: "Erreur serveur",
      error: error.message 
    });
  }
};


module.exports.getDemandeAvance = async (req, res) => {
    try {
      const formationlist = await DemandeAvance.find();
      if (!formationlist  ) {
        throw new Error("There is no avance demande");
      }
      res.status(200).json(formationlist);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };