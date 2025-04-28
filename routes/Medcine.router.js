const express = require('express');
const router = express.Router();
const MedcineController = require('../controllers/Medcine.controller');



router.post('/authentication',MedcineController.addMedcine);
router.post('/createAccountSecretary',MedcineController.addSecretary);
router.post('/addOrdonnance',MedcineController.addOrdonnance);
router.post('/login', MedcineController.loginMedcine);
router.get('/logout', MedcineController.logout);
router.get('/getAllMedcine',MedcineController.getAllMedcine);
router.get('/getAllSecretary',MedcineController.getAllSecretary);
router.get('/getAllOrdonnance',MedcineController.getAllOrdonnance);
router.get('/getMedcineById/:id',MedcineController.getMedcineById);
router.get('/getSecretaryById/:id',MedcineController.getSecretaryById);
// router.get('/getSecretaryByMedcineName/:loginMedcine',MedcineController.getSecretaryByMedcineName);
router.get('/getSecretaryByMedcineName/:loginMedcine', MedcineController.getSecretaryByMedcineName);
router.get('/searchMedcine/:speciality',MedcineController.getMedcineBySpeciality);
router.get('/getOrdonnanceByMedcine/:id', MedcineController.getOrdonnanceByMedcine);
router.get('/getOrdonnanceByPatient/:id', MedcineController.getOrdonnanceByPatient);
// router.put('/activateCompte/:token', MedcineController.activateCompteMedcine);
router.put('/updateAvailabilityMedicine/:id',MedcineController.UpdateAvailabilityMedicine);
router.put('/manageSecretaryAccount/:id',MedcineController.ManageSecretaryAccount);
router.delete('/deleteMedcine/:id',MedcineController.deleteMedcine);
router.delete('/deleteSecretary/:id',MedcineController.deleteSecretary);

module.exports = router;


