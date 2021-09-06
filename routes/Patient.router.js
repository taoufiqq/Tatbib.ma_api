const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/Patient.controller');


router.post('/authentication', PatientController.addPatient)
router.put('/activateCompte/:token', PatientController.activateComptePatient)
router.post('/login', PatientController.loginPatient);
router.get('/logout', PatientController.logout);
router.get('/getAllPatient',PatientController.getAllPatient);

module.exports = router;
