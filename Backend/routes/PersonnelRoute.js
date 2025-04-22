const express = require('express');
const router = express.Router();
const PersonnelController=require("../controllers/PersonnelController");
const uploadfile=require('../middelwares/uploadfile');


router.get('/allpersonnel', PersonnelController.getAllPersonnel);

router.delete('/deletepersonnel/:id',PersonnelController.deletePersonnel);
router.post('/addPersonnelWithimage',uploadfile.single("image"),PersonnelController.addPersonnelWithimage);
router.put('/updatepersonnel/:id',PersonnelController.updatePersonnel);


module.exports = router;

