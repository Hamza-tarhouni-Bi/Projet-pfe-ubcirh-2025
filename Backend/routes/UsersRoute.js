const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const uploadfile=require('../middelwares/uploadfile');


router.get('/allusers', UserController.getAllUsers);
router.post('/adduser',UserController.addUser);
router.post('/adduserwithimage', uploadfile.single("image"), UserController.addUserWithimage);


router.delete('/deleteuser/:id',UserController.deleteUser);

router.put('/updatepassword/:id',UserController.updatePassword);
router.put('/updateuser/:id',UserController.updateUser);
module.exports = router;
