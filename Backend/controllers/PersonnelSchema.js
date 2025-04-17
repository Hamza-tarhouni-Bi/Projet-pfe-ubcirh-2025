const userModal = require('../models/UserSchema');
const bcrypt=require("bcrypt");

module.exports.getAllUsers = async (req, res) => {
  try {
    const userlist = await userModal.find();
    if (!userlist  ) {
      throw new Error("Users not found");
    }
    res.status(200).json(userlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports.addUser = async (req, res) => {
    try {
        const { nom, prenom, email, password, role, age, user_image } = req.body;
        
        const newUser = new userModal({
            nom,
            prenom,
            email,
            password,
            role,
            age,
            user_image
        });

        const useradded = await newUser.save();
        res.status(200).json(useradded);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports.deleteUser = async (req, res) => {
    try {
        const{ id   }=req.params;
       const deleted= await userModal.findByIdAndDelete(id)
      
      res.status(200).json(deleted);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  module.exports.updatePassword = async (req, res) => {
    try {
        const{ id   }=req.params;
        const{password}=req.body;

        const salt=await bcrypt.genSalt()
        const hashPassword=await bcrypt.hash(password,salt);

      const user =await userModal.findByIdAndUpdate(id,{
        $set:{password:hashPassword}

      })
      
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  module.exports.updateUser = async (req, res) => {
    try {
        const{ id   }=req.params;
        const{nom,prenom,age}=req.body;

       
      const user =await userModal.findByIdAndUpdate(id,{
        $set:{nom,prenom,age}

      })
      
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };