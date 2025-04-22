const condidatureModal=require("../models/CondidatureSchema");

module.exports.getCondidature = async (req, res) => {
  try {
    const condidaturelist = await condidatureModal.find();
    if (!condidaturelist  ) {
      throw new Error("There is no condidature ");
    }
    res.status(200).json(condidaturelist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Ajouter un departement 

module.exports.addDepartment = async (req, res) => {
    try {
        const { nom } = req.body;
        
        const newDepartment = new departementModal({
            nom,
           
        });

        const departmentadded = await newDepartment.save();
        res.status(200).json(departmentadded);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};