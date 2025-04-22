const express = require('express');
const router = express.Router();
const OffreController=require('../controllers/OffreController');


router.get('/alloffre', OffreController.getAllOffres);
router.post('/addoffre',OffreController.addOffre);
router.delete('/deleteoffre/:id',OffreController.deleteOffre);
router.put('/updateoffre/:id',OffreController.updateOffre);

module.exports = router;
