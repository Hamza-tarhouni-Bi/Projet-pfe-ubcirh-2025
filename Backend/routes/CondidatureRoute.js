const express = require('express');
const router = express.Router();
const CondidatureController = require('../controllers/CondidatureController');
const uploadCV = require('../middelwares/uploadCV');


router.get('/allcondidature', CondidatureController.getCondidature);
router.post('/addcondidature', uploadCV.single("cv"), CondidatureController.addCondidature);
router.put('/updatecondidature/:id', CondidatureController.updateCondidatureStatus);
router.delete('/deletecondidature/:id',CondidatureController.deleteCondidature);
module.exports = router;