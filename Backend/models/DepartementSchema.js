const mongoose = require('mongoose');
const departementSchema=new mongoose.Schema({
    nom:{ type: String,
       required: true}
    


},{ timestamps: true })

const Departement = mongoose.model("Departement", departementSchema);
module.exports = Departement;