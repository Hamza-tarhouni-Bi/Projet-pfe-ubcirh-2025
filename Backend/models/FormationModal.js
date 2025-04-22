const mongoose = require("mongoose");
const formationSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    durée: { type: Number, required: true },
    nbplaces: { type: Number, required: true },
    nbinscrits: { type: Number, required: true },
    statut:{type:String,required:true},
  },
  { timestamps: true }
);

const Formation = mongoose.model("Formation", formationSchema);
module.exports = Formation;
