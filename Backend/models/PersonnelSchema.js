const mongoose = require('mongoose');
const personnelSchema=new mongoose.Schema({
    nom:{ type: String,
       required: true},
    prenom:{ type: String,
     required: true},
     email:{
        type: String,
        required: true,
        unique: true
     },
     password:{
        type: String,
        required: true,
     },
     departement:{
        type:String,
        required:true,
        
     },
     sexe:{ 
        type:String,
        enum: ['homme', 'femme'],
        required: true},

    soldedeconge:{
        type:Number,
        required:true,

    },
    salaire:{
        type:Number,
        required:true,
    },
    image:
      { type: String, required: false, default: "client.png" }
        
    
     
    


},{ timestamps: true })

const Personnel = mongoose.model("Personnel", personnelSchema);
module.exports = Personnel;