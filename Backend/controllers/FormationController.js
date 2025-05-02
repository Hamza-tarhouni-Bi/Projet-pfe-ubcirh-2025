const formationModal=require("../models/FormationModal");

//Liste des formations
module.exports.getAllFormations = async (req, res) => {
  try {
    const formationlist = await formationModal.find();
    if (!formationlist  ) {
      throw new Error("There is no formation ");
    }
    res.status(200).json(formationlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Ajouter une formations

module.exports.addFormation = async (req, res) => {
    try {
        const { titre, description, date, durée, nbplaces, nbinscrits, statut } = req.body;
        
        const newFormation = new formationModal({
            titre, description, date, durée, nbplaces, nbinscrits, statut
           
        });

        const formationadded = await newFormation.save();
        res.status(200).json(formationadded);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//update offre

  module.exports.updateFormation = async (req, res) => {
    try {
        const{ id   }=req.params;
        const{titre, description, date, durée, nbplaces, nbinscrits, statut}=req.body;

       
      const formation=await formationModal.findByIdAndUpdate(id,{
        $set:{titre, description, date, durée, nbplaces, nbinscrits, statut}

      })
      
      res.status(200).json(formation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

//Supprimer une formation 

module.exports.deleteFormation = async (req, res) => {
    try {
        const{ id   }=req.params;
       const deleted= await formationModal.findByIdAndDelete(id)
      
      res.status(200).json(deleted);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  module.exports.updateNbInscrits = async (req, res) => {
    try {
      const { id } = req.params;
      const { action } = req.body; // 'increment' ou 'decrement'
  
      let update = {};
      if (action === 'increment') {
        update = { $inc: { nbinscrits: 1 } };
      } else if (action === 'decrement') {
        update = { $inc: { nbinscrits: -1 } };
      } else {
        throw new Error("Action must be 'increment' or 'decrement'");
      }
  
      const updatedFormation = await formationModal.findByIdAndUpdate(
        id,
        update,
        { new: true }
      );
  
      if (!updatedFormation) {
        throw new Error("Formation not found");
      }
  
      res.status(200).json(updatedFormation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };