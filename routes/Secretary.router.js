const express = require('express');
const router = express.Router();
const SecretaryController = require('../controllers/Secretary.controller');

router.post('/login', SecretaryController.loginSecretary);
router.get('/logout', SecretaryController.logout);
router.put('/confirmAppointment/:id',SecretaryController.confirmAppointment);
router.put('/updateAppointment/:id',SecretaryController.updateAppointment);
router.delete('/deleteAppointment/:id',SecretaryController.deleteAppointment);
router.put('/alertAppointment/:id',SecretaryController.alertAppointment);
module.exports = router;