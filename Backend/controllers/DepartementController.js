const departementModal=require('../models/DepartementSchema');


//Liste des departements
module.exports.getAllDepartments = async (req, res) => {
  try {
    const departmentlist = await departementModal.find();
    if (!departmentlist  ) {
      throw new Error("There is no departement ");
    }
    res.status(200).json(departmentlist);
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

//Supprimer un departement
module.exports.deleteDepartment = async (req, res) => {
    try {
        const{ id   }=req.params;
       const deleted= await departementModal.findByIdAndDelete(id)
      
      res.status(200).json(deleted);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };