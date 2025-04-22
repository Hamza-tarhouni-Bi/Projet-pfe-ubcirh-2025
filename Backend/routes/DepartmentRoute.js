const express = require('express');
const router = express.Router();
const DepartementController=require('../controllers/DepartementController');


router.get('/alldepartment', DepartementController.getAllDepartments);
router.post('/adddepartment',DepartementController.addDepartment);
router.delete('/deletedepartment/:id',DepartementController.deleteDepartment);
router.put('/updatedepartment/:id',DepartementController.updateDepartment);
module.exports = router;
