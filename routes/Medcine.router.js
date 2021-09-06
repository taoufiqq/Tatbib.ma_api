const express = require('express');
const router = express.Router();
const MedcineController = require('../controllers/Medcine.controller');



router.post('/authentication',MedcineController.addMedcine);
router.post('/login', MedcineController.loginMedcine);
router.get('/logout', MedcineController.logout);
router.get('/getAllMedcine',MedcineController.getAllMedcine);


module.exports = router;


