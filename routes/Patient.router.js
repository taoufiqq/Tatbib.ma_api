const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/Patient.controller');


router.post('/authentication', PatientController.addPatient)
router.post('/login', PatientController.loginPatient);
// router.put('/activateCompte/:token', PatientController.activateComptePatient)
router.put('/updatePatient/:id', PatientController.updatePatient)
router.get('/logout', PatientController.logout);
router.get('/getPatientById/:id', PatientController.getPatientById);
router.get('/getAllPatient',PatientController.getAllPatient);
router.delete('/deletePatient/:id',PatientController.deletePatient);
router.delete('/deleteAppointment/:id',PatientController.deleteAppointment);

module.exports = router;
