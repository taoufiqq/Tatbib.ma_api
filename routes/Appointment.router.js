const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/Appointment.controller');

router.get('/getAllAppointment',AppointmentController.getAllAppointment);
router.post('/addAppointment',AppointmentController.addAppointment);
module.exports = router;
