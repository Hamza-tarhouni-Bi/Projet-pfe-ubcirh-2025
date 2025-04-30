const express = require('express');
const router = express.Router();
const PersonnelController = require("../controllers/PersonnelController");
const uploadfile = require('../middelwares/uploadfile');
const { requireAuthPersonnel } = require("../middelwares/authMiddelware");

// Routes pour Personnel
router.get('/allpersonnel', PersonnelController.getAllPersonnel);
router.get('/getpersonnel',PersonnelController.getPersonnelWithId);

router.delete('/deletepersonnel/:id', PersonnelController.deletePersonnel);

router.post('/addPersonnel', uploadfile.single('image'), PersonnelController.addPersonnelWithimage);

router.put('/updatepersonnel/:id', uploadfile.single('image'), PersonnelController.updatePersonnel);

router.post('/login', PersonnelController.login);

router.post('/logout', requireAuthPersonnel, PersonnelController.logout);

module.exports = router;