const condidatureModal = require("../models/CondidatureSchema");

module.exports.getCondidature = async (req, res) => {
  try {
    const condidaturelist = await condidatureModal.find();
    if (!condidaturelist) {
      return res.status(404).json({ message: "There is no condidature" });
    }
    return res.status(200).json(condidaturelist);
  } catch (error) {
    console.error("Error in getCondidature:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports.addCondidature = async (req, res) => {
  try {
    // Validate required fields
    const { nom, prenom, adresse, email, tel } = req.body;
    
    if (!nom || !prenom || !adresse || !email || !tel) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const condidatureData = { 
      nom, 
      prenom, 
      adresse, 
      email, 
      tel 
    };
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "CV file is required" });
    }
    
    // Add file path to data
    condidatureData.cv = req.file.filename;
    
    // Create and save new candidate
    const condidature = new condidatureModal(condidatureData);
    const condidatureadded = await condidature.save();
    
    return res.status(201).json(condidatureadded);
    
  } catch (error) {
    console.error("Error in addCondidature:", error);
    // Handle duplicate email error specifically
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(400).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: error.message });
  }
};

// Ajouter cette nouvelle méthode pour mettre à jour le statut d'une candidature
module.exports.updateCondidatureStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Vérifier que le statut est valide
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    
    // Trouver et mettre à jour la candidature
    const updatedCandidature = await condidatureModal.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true, runValidators: true }
    );
    
    if (!updatedCandidature) {
      return res.status(404).json({ message: "Candidature not found" });
    }
    
    return res.status(200).json(updatedCandidature);
    
  } catch (error) {
    console.error("Error in updateCondidatureStatus:", error);
    return res.status(500).json({ message: error.message });
  }
};
