const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/Appointment.controller');

router.get('/getAllAppointment',AppointmentController.getAllAppointment);
router.post('/addAppointment',AppointmentController.addAppointment);
router.get('/getAppointmentPatient/:id', AppointmentController.getAppointmentPatient);
router.get('/getAppointmenById/:id', AppointmentController.getAppointmentById);
router.get('/getAppointmentMedcine/:id', AppointmentController.getAppointmentMedcine);
router.get('/getAppointmentSecretary/:loginMedcine', AppointmentController.getAppointmentSecretary);
module.exports = router;
