const express = require('express');
const router = express.Router();
const MedicineController = require('../controllers/Medicine.controller');



router.post('/authentication',MedicineController.addMedicine);
router.post('/createAccountSecretary',MedicineController.addSecretary);
router.post('/addOrdonnance',MedicineController.addOrdonnance);
router.post('/login', MedicineController.loginMedicine);
router.get('/logout', MedicineController.logout);
router.get('/getAllMedicine',MedicineController.getAllMedicine);
router.get('/getAllSecretary',MedicineController.getAllSecretary);
router.get('/getAllOrdonnance',MedicineController.getAllOrdonnance);
router.get('/getMedicineById/:id',MedicineController.getMedicineById);
router.get('/getSecretaryById/:id',MedicineController.getSecretaryById);
router.get('/getSecretaryByMedicineName/:loginMedicine',MedicineController.getSecretaryByMedicineName);
router.get('/searchMedicine/:speciality',MedicineController.getMedicineBySpeciality);
router.get('/getOrdonnanceByMedicine/:id', MedicineController.getOrdonnanceByMedicine);
router.get('/getOrdonnanceByPatient/:id', MedicineController.getOrdonnanceByPatient);
// router.put('/activateCompte/:token', MedicineController.activateCompteMedicine);
router.put('/updateAvailablityMedicine/:id',MedicineController.UpdateAvailablityMedicine);
router.put('/manageSecretaryAccount/:id',MedicineController.ManageSecretaryAccount);
router.delete('/deleteMedicine/:id',MedicineController.deleteMedicine);
router.delete('/deleteSecretary/:id',MedicineController.deleteSecretary);

module.exports = router;


