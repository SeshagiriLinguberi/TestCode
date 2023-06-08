const express = require('express');
const router = express.Router();
const validation = require('../../utils/validations');
const usercontroller =  require('../../controllers/user.controller')
router.get('/get/all/user/details',usercontroller.getUserDetails);
router.post('/add/user',usercontroller.addUserDetails);
router.post('/user/update/user',validation.verifyJWT,usercontroller.updateUser);
router.post('/user/login',usercontroller.userLoign);
router.post('/user/change/password',validation.verifyJWT,usercontroller.changePassword);
router.post('/user/forget/password',usercontroller.forgetPassword);
module.exports = router;