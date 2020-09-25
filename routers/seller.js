const express = require('express');
const router = express.Router();
const controllers=require('../controllers/sellerController')


router.get('/signup',controllers.signup);
router.get('/login',controllers.login);
router.post('/create',controllers.createUser);
router.get('/profile',controllers.profile);
router.post('/loginCheck',controllers.loginCheck);
router.post('/upload',controllers.postUpload);
router.get('/upload',controllers.getUpload);
router.post('/fotpgen',controllers.fotpgen);
router.post('/fverify',controllers.fverify);
router.get('/user',controllers.userProfile);
router.get('/logout',controllers.logout);

module.exports=router;