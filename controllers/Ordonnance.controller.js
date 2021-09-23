const Ordonnance = require('../models/Ordonnance.model');

//_______________________ get All Ordonnance ________________________
const getAllOrdonnance = (req, res) => {
    Ordonnance.find()
          .then(OrdonnanceInfos => {
            res.status(200).json(OrdonnanceInfos);
          }).catch(error => {
            console.log(error);
            res.status(500).json({
              message: "Error!",
              error: error
            });
          });
      };

 // -------------------------- get Ordonnance to Patient --------------------------- 
//  const getOrdonnancePatient = (req, res) => {

//     Ordonnance.find({loginMedcine:req.params.loginMedcine})
//       .populate('patient')
//       .populate('medcine')
//       .then(Appointment => {
//         res.status(200).json(Appointment);
//       }).catch(err => {
//           if(err.kind === 'ObjectId') {
//               return res.status(404).send({
//                   message: "Appointment not found with id " + req.params.id,
//                   error: err
//               });                
//           }
//           return res.status(500).send({
//               message: "Error retrieving Appointment with id " + req.params.id,
//               error: err
//           });
//       });
//     };

































module.exports={
    // getAllOrdonnance,addAppointment,getAppointmentPatient,getAppointmentSecretary,getAppointmentById,getAppointmentMedcine
};