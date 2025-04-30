const DemandeFormation = require('../models/DemandeFormation');

exports.addDemandeFormation = async (req, res) => {
  try {
    const { nom, prenom, email, nomFormation } = req.body;
    
    // Validation simple
    if (!nom || !prenom || !email || !nomFormation) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const nouvelleDemande = new DemandeFormation({
      nom,
      prenom,
      email,
      nomFormation,
      statut: 'En attente'
    });

    await nouvelleDemande.save();
    res.status(201).json({ message: "Demande créée avec succès" });
    
  } catch (error) {
    res.status(500).json({ 
      message: "Erreur serveur",
      error: error.message 
    });
  }
};
module.exports.getDemandeFormation = async (req, res) => {
    try {
      const formationlist = await DemandeFormation.find();
      if (!formationlist  ) {
        throw new Error("There is no formation ");
      }
      res.status(200).json(formationlist);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// exports.getAllDemandesFormation = async (req, res) => {
//     try {
//       const demandes = await DemandeFormation.find()
//         .sort({ createdAt: -1 }) // Tri par date décroissante
//         .populate('employe', 'nom prenom email'); // Optionnel: infos employé
  
//       res.status(200).json(demandes);
//     } catch (error) {
//       res.status(500).json({ 
//         message: "Erreur lors de la récupération des demandes",
//         error: error.message 
//       });
//     }
//   };


  

//   exports.updateDemandeFormation = async (req, res) => {
//     try {
//       const { statut } = req.body;
      
//       // Seuls certains champs peuvent être modifiés (ajustez selon besoins)
//       const updateData = { 
//         statut,
//         // Ajoutez d'autres champs modifiables si nécessaire
//       };
  
//       const demandeMaj = await DemandeFormation.findByIdAndUpdate(
//         req.params.id,
//         updateData,
//         { new: true, runValidators: true } // Retourne le doc mis à jour et valide les modifications
//       );
  
//       if (!demandeMaj) {
//         return res.status(404).json({ message: "Demande non trouvée" });
//       }
  
//       res.status(200).json(demandeMaj);
//     } catch (error) {
//       res.status(500).json({ 
//         message: "Erreur lors de la mise à jour de la demande",
//         error: error.message 
//       });
//     }
//   };