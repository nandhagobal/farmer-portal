const express = require('express');
const router = express.Router();
const controllers=require('../controllers/homeController')


router.post('/home',controllers.getHome);
router.post('/create',controllers.createUser);
router.get('/profile',controllers.profile);
router.get('/signup',controllers.signup);
router.get('/login',controllers.login);

router.post('/loginCheck',controllers.loginCheck);
router.get('/item/:id',controllers.getItem);
router.post('/addCart',controllers.addCart);
router.get('/getCart',controllers.getCart);
router.delete('/remove/:id',controllers.removeItem);
router.get('/myOrder',controllers.myOrder);
router.get('/success',controllers.success);
router.get('/cancel',controllers.cancel);
router.get('/checkout',controllers.checkOut)
router.get('/user',controllers.userProfile);

router.post('/botpgen',controllers.botpgen);
router.post('/bverify',controllers.bverify);
router.get('/logout',controllers.logout);






module.exports=router;