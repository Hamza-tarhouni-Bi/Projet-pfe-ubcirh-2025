const express = require('express');
const router = express.Router();
const FormationController=require('../controllers/FormationController');

router.get('/getformation', FormationController.getAllFormations);
router.post('/addformation',FormationController.addFormation);
router.put('/updateformation/:id',FormationController.updateFormation);
router.delete('/deleteformation/:id',FormationController.deleteFormation);
module.exports = router;

