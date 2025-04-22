const personnelModal = require('../models/PersonnelSchema');
const bcrypt=require("bcrypt");


//Liste des personnels
module.exports.getAllPersonnel = async (req, res) => {
  try {
    const personnellist = await personnelModal.find();
    if (!personnellist  ) {
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
        const{ id   }=req.params;
       const deleted= await personnelModal.findByIdAndDelete(id);
      
      res.status(200).json(deleted);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  module.exports.addPersonnelWithimage = async (req, res) => {
    try {
      const personnelData = { ...req.body };
  
      // Si une image est uploadée
      if (req.file) {
        personnelData.image = req.file.filename;
      } else {
        // Sinon, utiliser l'image par défaut
        personnelData.image = 'defaultuser.jpg';
      }
  
      const personnel = new personnelModal(personnelData);
      const personneladded = await personnel.save();
  
      res.status(201).json(personneladded);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

//update personnel 

module.exports.updatePersonnel = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    
    
    const updated = await personnelModal.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ error: "Personnel non trouvé" });
    }
    
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

