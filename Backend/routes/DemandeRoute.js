const express = require('express');
const router = express.Router();
const DemandeFormationCtrl = require("../controllers/DemandeFormation");
const DemandeAvanceCtrl = require("../controllers/DemandeAvanceController");
const DemandeCongeCtrl = require("../controllers/DemandeCongeController");
const { requireAuthPersonnel } = require("../middelwares/authMiddelware");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration Multer intégrée directement
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
});

// Routes pour les demandes de formation
router.post('/adddemandeformation', requireAuthPersonnel, DemandeFormationCtrl.addDemandeFormation);
router.get('/alldemandeformation', requireAuthPersonnel, DemandeFormationCtrl.getDemandeFormation);

// Routes pour les demandes d'avance
router.post('/adddemandeavance', requireAuthPersonnel, DemandeAvanceCtrl.addDemandeAvance);
router.get('/alldemandeavance', requireAuthPersonnel, DemandeAvanceCtrl.getDemandeAvance);

// Routes pour les demandes de congé
router.post('/adddemandeconge', 
  requireAuthPersonnel, 
  DemandeCongeCtrl.addDemandeConge
);

router.get('/alldemandeconge', DemandeCongeCtrl.getDemandeConge);
router.put('/updatedemandeconge/:id',DemandeCongeCtrl.updateDemandeConge);

module.exports = router;