const DemandeConge = require('../models/DemandeCongeSchema');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/justificatifs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'justificatif-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non supporté. Seuls JPEG, PNG et PDF sont autorisés.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
}).single('medicalFile');

exports.addDemandeConge = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      // Gestion des erreurs de Multer
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'Le fichier est trop volumineux (max 5MB)' });
        }
        return res.status(400).json({ message: 'Erreur lors du téléchargement du fichier' });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }

      // Vérification du token
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: "Authentification requise" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Validation des champs
      const { startDate, endDate, type, reason, notes } = req.body;
      if (!startDate || !endDate || !type || !reason) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis" });
      }

      // Validation spécifique pour les congés maladie
      if (type === 'congé maladie' && !req.file) {
        return res.status(400).json({ message: "Un justificatif médical est requis pour les congés maladie" });
      }

      // Validation des dates
      const dateDebut = new Date(startDate);
      const dateFin = new Date(endDate);
      if (dateDebut > dateFin) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "La date de fin doit être postérieure à la date de début" });
      }

      // Calcul de la durée
      const duree = Math.ceil((dateFin - dateDebut) / (1000 * 60 * 60 * 24)) + 1;

      // Vérification du solde pour les congés payés
      if (type === 'congé payé' && decoded.soldeConge < duree) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({
          message: `Solde de congé insuffisant. Vous avez ${decoded.soldeConge} jours disponibles.`
        });
      }

      // Création de la demande
      const demande = new DemandeConge({
        nom: decoded.nom,
        prenom: decoded.prenom,
        email: decoded.email,
        DateDebut: dateDebut,
        DateFin: dateFin,
        Duree: duree,
        type,
        motif: reason,
        notes: notes || '',
        statut: 'En attente',
        justificatif: req.file ? path.basename(req.file.path) : null
      });

      await demande.save();

      return res.status(201).json({
        message: "Demande de congé enregistrée avec succès",
        data: {
          ...demande.toObject(),
          justificatif: req.file ? `/justificatifs/${path.basename(req.file.path)}` : null
        }
      });

    } catch (error) {
      console.error("Erreur:", error);
      
      // Nettoyage: supprimer le fichier uploadé en cas d'erreur
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: "Token invalide" });
      }

      return res.status(500).json({ 
        message: "Erreur serveur",
        error: req.app.get("env") === "development" ? error.message : undefined
      });
    }
  });
};