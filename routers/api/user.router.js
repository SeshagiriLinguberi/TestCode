const express = require('express');
const router = express.Router();
const validation = require('../../utils/validations');
const usercontroller =  require('../../controllers/user.controller')
router.get('/get/all/user/details',usercontroller.getUserDetails);
router.get('/get/all/in/active/user/details',usercontroller.getAllInActiveUserDetails);

router.post('/add/user',usercontroller.addUserDetails);
router.post('/update/user',validation.verifyJWT,usercontroller.updateUser);
router.post('/login/user',usercontroller.userLoign);
router.post('/change/password',validation.verifyJWT,usercontroller.changePassword);
router.post('/forget/password',usercontroller.forgetPassword);
router.post('/get/user/by/id',validation.verifyJWT,usercontroller.getUserById);
router.post('/delete/user/by/id',usercontroller.deleteUserById);
router.post('/delete/user/permenently',usercontroller.deleteUserPermently);
router.post('/active/user/by/id',usercontroller.activeUser);
router.post('/verify/user/otp',usercontroller.otpVerification2);

module.exports = router;