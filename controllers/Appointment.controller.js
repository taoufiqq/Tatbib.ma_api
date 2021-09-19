const Appointment = require('../models/Appointment.model');


//_______________________ get All Appointment ________________________
const getAllAppointment = (req, res) => {
  Appointment.find()
        .then(AppointmentInfos => {
          res.status(200).json(AppointmentInfos);
        }).catch(error => {
          console.log(error);
          res.status(500).json({
            message: "Error!",
            error: error
          });
        });
    };

 
// ----------------- add Appointment --------------------

const addAppointment = (req,res) =>{
  
  const appointmentDate= req.body.appointmentDate;
  const status = "Unconfirmed";
  const patient= req.body.patient;
  const medcine= req.body.medcine;
 
  const appointmentPush = new Appointment({
        appointmentDate,
        status,
        patient,
        medcine

   });
 //Save
 appointmentPush
 .save()
 .then(() => res.status(201).json("Appointment added successfully"))
 .catch((err) => res.status(400).json("Error :" + err));
 
 };











module.exports={
        getAllAppointment,addAppointment
    };