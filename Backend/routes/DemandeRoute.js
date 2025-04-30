const express = require('express');
const router = express.Router();
const DemandeFormationCtrl = require("../controllers/DemandeFormation");
const DemandeAvanceCtrl = require("../controllers/DemandeAvanceController");
const DemandeCongeCtrl =require("../controllers/DemandeCongeController");
const { requireAuthPersonnel } = require("../middelwares/authMiddelware");

// Route pour ajouter une demande de formation
router.post('/adddemandeformation', requireAuthPersonnel, DemandeFormationCtrl.addDemandeFormation);

router.post('/adddemandeavance', requireAuthPersonnel, DemandeAvanceCtrl.addDemandeAvance);

router.post('/adddemandeconge', requireAuthPersonnel, DemandeCongeCtrl.addDemandeConge);

router.get('/alldemandeavance',DemandeAvanceCtrl.getDemandeAvance);
router.get('/alldemandeformation',DemandeFormationCtrl.getDemandeFormation);
router.post('/alldemandeconge', requireAuthPersonnel, DemandeFormationCtrl.getDemandeFormation);
module.exports = router;
