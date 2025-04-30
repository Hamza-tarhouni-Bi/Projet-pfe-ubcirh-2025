const jwt = require('jsonwebtoken');
const Personnel = require('../models/PersonnelSchema');

const requireAuthPersonnel = async (req, res, next) => {
  const token = req.cookies.jwt_token_ubcirh;
  
  if (!token) {
    return res.status(401).json({ message: 'Non autorisé, aucun token' });
  }

  try {
    const decoded = jwt.verify(token, 'net ubcirh secret');
    const personnel = await Personnel.findById(decoded.id);

    if (!personnel) {
      return res.status(401).json({ message: 'Personnel non trouvé' });
    }

    req.personnel = personnel; // 👈 Mettre personnel dans la requête

    next();
  } catch (error) {
    console.error('Erreur Auth Middleware:', error);
    res.status(401).json({ message: 'Non autorisé, token invalide' });
  }
};

module.exports = { requireAuthPersonnel };
