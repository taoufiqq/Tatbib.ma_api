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

//--------------------------get Appointment By Id--------------------------- 
const getAppointmentById = (req, res) => {
  Appointment.findById(req.params.id)
  .populate('medcine')
  .populate('patient')
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
// ----------------- add Appointment --------------------

const addAppointment = async (req,res) =>{
  

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
   let result = await appointmentPush.save();
   res.send(result)
 
 };

  // -------------------------- get Appointment Patient --------------------------- 
  const getAppointmentPatient = (req, res) => {
          //  console.log(req.params.id);
    Appointment.find({patient:req.params.id})
        .populate('medcine')
        .populate('patient')
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
  const getAppointmentMedcine = (req, res) => {
    //  console.log(req.params.id);
Appointment.find({medcine:req.params.id})
  .populate('patient')
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

  // -------------------------- get Appointment to Secretary --------------------------- 
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
        getAllAppointment,addAppointment,getAppointmentPatient,getAppointmentSecretary,getAppointmentById,getAppointmentMedcine
    };