const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/Appointment.controller');

router.get('/getAllAppointment',AppointmentController.getAllAppointment);
router.post('/addAppointment',AppointmentController.addAppointment);
router.get('/getAppointmenPatient/:id', AppointmentController.getAppointmentPatient);
router.get('/getAppointmentSecretary/:loginMedcine', AppointmentController.getAppointmentSecretary);
module.exports = router;
