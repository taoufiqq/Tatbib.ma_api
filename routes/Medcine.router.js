const express = require('express');
const router = express.Router();
const MedcineController = require('../controllers/Medcine.controller');

import { validate } from '../middlewares/validate';
import {
  forgotPasswordSchema,
  resetPasswordSchema
} from '../validations/auth.validation';
// Rate limiting (prevent brute force attacks)
const resetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
  });
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
router.post('/forgot-password', MedcineController.forgotPassword);
router.post('/reset-password/:token', MedcineController.resetPassword);

module.exports = router;


