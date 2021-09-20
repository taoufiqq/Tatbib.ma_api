const { populate } = require('../models/Appointment.model');
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
  

  const date= req.body.date;
  const time= req.body.time;
  const status = "Unconfirmed";
  const patient= req.body.patient;
  const medcine= req.body.medcine;
  const loginMedcine= req.body.loginMedcine;
 
  const appointmentPush = new Appointment({
        date,
        time,
        status,
        patient,
        medcine,
        loginMedcine

   });
 //Save
 appointmentPush
 .save()
 .then(() => res.status(201).json("Appointment added successfully"))
 .catch((err) => res.status(400).json("Error :" + err));
 
 };

  // -------------------------- get Appointment Patient --------------------------- 
  const getAppointmentPatient = (req, res) => {
          //  console.log(req.params.id);
    Appointment.find({patient:req.params.id})
        .populate('medcine')
        .then(Appointment => {
          res.status(200).json(Appointment);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Appointment not found with id " + req.params.id,
                    error: err
                });                
            }
            return res.status(500).send({
                message: "Error retrieving Appointment with id " + req.params.id,
                error: err
            });
        });
  };

  // -------------------------- get Appointment Medcine --------------------------- 
  const getAppointmentSecretary = (req, res) => {

Appointment.find({loginMedcine:req.params.loginMedcine})
  .populate('patient')
  .populate('medcine')
  .then(Appointment => {
    res.status(200).json(Appointment);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Appointment not found with id " + req.params.id,
              error: err
          });                
      }
      return res.status(500).send({
          message: "Error retrieving Appointment with id " + req.params.id,
          error: err
      });
  });
};







module.exports={
        getAllAppointment,addAppointment,getAppointmentPatient,getAppointmentSecretary
    };