const mongoose = require('mongoose');
const bcrypt=require("bcrypt");

const personnelSchema=new mongoose.Schema({
    nom:{ type: String,
       required: true},
    prenom:{ type: String,
  },
     tel:{
      type:Number,
      
      unique:true,

      max: 99999999,
     },
     email:{
        type: String,
       
        unique: true
     },
     password:{
        type: String,
      
     },
     departement:{
        type:String,
       
        
     },
     sexe:{ 
        type:String,
        enum: ['homme', 'femme'],
       },

    soldedeconge:{
        type:Number,
     

    },
    salaire:{
      type:Number,
 
     }
        ,
    role:{
      type:String,
      enum:["drh","personnel"],
      default:"personnel",
      
    }
    


},{ timestamps: true })

personnelSchema.pre("save", async function(next) {
    try {
        if (!this.isModified('password')) return next(); 
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

personnelSchema.statics.login= async function (email,password){
 
      const personnel =await this.findOne({email});
      if(personnel){
         const auth =await bcrypt.compare(password,personnel.password);
         if (auth){
            
            return personnel
         }
         throw new Error("Incorrect Password");
      }
      throw new Error("Incorrect email")
   };


   


const Personnel = mongoose.model("Personnel", personnelSchema);
module.exports = Personnel;