const offreModal=require("../models/OffreSchema");
//Liste offre
module.exports.getAllOffres = async (req, res) => {
    try {
      const offrelist = await offreModal.find();
      if (!offrelist) {
        throw new Error("Offre not found");
      }
      res.status(200).json(offrelist);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

//Ajouter une offre
  module.exports.addOffre = async (req, res) => {
      try {
          const { titre,lieu,date } = req.body;
          
          const newOffre = new offreModal({ titre,lieu,date });
  
          const offreadded = await newOffre.save();
          res.status(200).json(offreadded);
          
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  };

//Suppression d une offre

module.exports.deleteOffre = async (req, res) => {
    try {
        const{ id  }=req.params;
       const deleted= await offreModal.findByIdAndDelete(id);
      
      res.status(200).json(deleted);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //update offre

  module.exports.updateOffre = async (req, res) => {
    try {
        const{ id   }=req.params;
        const{titre,lieu,date}=req.body;

       
      const offre =await offreModal.findByIdAndUpdate(id,{
        $set:{titre,lieu,date}

      })
      
      res.status(200).json(offre);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
