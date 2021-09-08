const express = require('express');
const router = express.Router();
const MedcineController = require('../controllers/Medcine.controller');



router.post('/authentication',MedcineController.addMedcine);
router.post('/login', MedcineController.loginMedcine);
router.get('/logout', MedcineController.logout);
router.get('/getAllMedcine',MedcineController.getAllMedcine);
router.get('/getAllSecretary',MedcineController.getAllSecretary);
router.get('/getMedcineById/:id',MedcineController.getMedcineById);
router.get('/getSecretaryById/:id',MedcineController.getSecretaryById);
router.put('/activateCompte/:token', MedcineController.activateCompteMedcine);
router.put('/updateAvailablityMedcine/:id',MedcineController.updateAvailablityMedcine);
router.put('/activateCompteSecretary/:id',MedcineController.ActivateCompteSecretary);
router.delete('/deleteMedcine/:id',MedcineController.deleteMedcine);

module.exports = router;


