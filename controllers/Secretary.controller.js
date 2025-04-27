const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const jwt_decode = require('jwt-decode');

const Secretary = require('../models/Secretary.model');
const Appointment = require('../models/Appointment.model');
const Patient = require('../models/Patient.model');

//_______________________ Secretary authentication________________________


     
//-------------------------login Secretary-----------------------------
      
const loginSecretary = (req, res) => {
  let login = req.body.login;
  let password = req.body.password;

  Secretary.findOne({ login: login })
    .then(secretary => {
      if (secretary) {
        bcrypt.compare(password, secretary.password, function(err, result) {
          if (err) {
            return res.status(500).json({
              error: err
            });
          }
          
          if (result) {
            // Check secretary status before generating token
            if (secretary.status === "InActive") {
              return res.status(403).json({
                status: 'InActive',
                message: 'Account Inactive'
              });
            } 
            else if (secretary.status === "Block") {
              return res.status(403).json({
                status: 'Block',
                message: 'Account Blocked'
              });
            }
            
            // Generate token if status is active
            let tokenSecretary = jwt.sign({ login: login }, 'tokenkey', (err, tokenSecretary) => {
              if (err) {
                return res.status(500).json({
                  error: "Failed to generate token"
                });
              }
              
              // Normalize the role before sending
              const normalizedRole = secretary.roleSecretary.toLowerCase();
              
              res.cookie("tokenSecretary", tokenSecretary);
              res.json({
                tokenSecretary: tokenSecretary,
                roleSecretary: normalizedRole, // Send normalized role
                status: secretary.status,
                id: secretary.id,
                loginMedcine: secretary.loginMedcine
              });
            });
          } else {
            res.status(401).json({
              message: 'Password incorrect. Please try again!'
            });
          }
        });
      } else {
        res.status(404).json({
          message: 'Secretary not found'
        });
      }
    }).catch(err => {
      res.status(500).json({
        error: err.message
      });
    });
};
 //-------------------------logout Secretary and remove token-----------------------------   
     const logout = (req, res) => {
        const deconnect = res.clearCookie("tokenPatient")
      
        res.json({
            message: 'Secretary is Signout !!'
        })
      }
 //________________________ updating Appointment ____________________     
const confirmAppointment = async (req, res) => {
        // Find Appointment By ID and update it

        const {email} = req.body.email;
        const {dateTime} = req.body.dateTime;
   
        Appointment.updateOne(
                         {_id: req.params.id},
                          {
                            status : req.body.status,
                          }
                        )
        .populate('patient')
        .then(() => res.status(201).json("Appointment updated successfully"))
        .catch((err) => res.status(400).json("Error :" + err));
        console.log(req.body.email);
        // Patient.find(email)
        // .then(Patient => {
        //   res.status(200).json(Patient.email);
        //   email = Patient.email;
// ---------------------- send email Confirmation ------------------------------- 

if (req.body.status === "Confirmed") {
  const transport = nodemailer.createTransport({
    service: "gmail",
        auth: {
          user: 'tatbib34@gmail.com',//email
          pass: 'youcode2020'//password
        }
    })
  
     await transport.sendMail({
        from: 'tatbib34@gmail.com',
        to: req.body.email,
        subject: "Email Confirmation Appointment",
        html: `<div className="email" style="
        border: 4px solid green;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px;
        text-align: center; 
        color:green;
        ">
        <h2>Your appointment has been confirmed</h2>
        <h4>please respect the schedule you have chosen </h4>
        <h4>date && time: ${req.body.dateTime}</h4>
 
    `
    })
  
} else {
  const transport = nodemailer.createTransport({
    service: "gmail",
        auth: {
          user: 'tatbib34@gmail.com',//email
          pass: 'youcode2020'//password
        }
    })
  
     await transport.sendMail({
        from: 'tatbib34@gmail.com',
        to: req.body.email,
        subject: "Email UnConfirmed Appointment",
        html: `
        <div className="email" style="
            border: 4px solid red;
            padding: 20px;
            font-family: sans-serif;
            line-height: 2;
            font-size: 20px;
            text-align: center; 
            color:red;
            ">
            <h2>Your appointment has been UnConfirmed</h2>
            </h4>for more details please check your account</h4>
    `
    })
}
// })
};
 //________________________ updating Appointment ____________________     
 const alertAppointment = async (req, res) => {
  // Find Appointment By ID and update it

  const {email} = req.body.email;
  const {dateTime} = req.body.dateTime;
  Appointment.findOne({_id: req.params.id})
  .populate('patient')
  .then(() => res.status(201).json("Appointment updated successfully"))
  .catch((err) => res.status(400).json("Error :" + err));
  console.log(req.body.email);
// ---------------------- send email Confirmation ------------------------------- 
const transport = nodemailer.createTransport({
service: "gmail",
  auth: {
    user: 'tatbib34@gmail.com',//email
    pass: 'youcode2020'//password
  }
})

await transport.sendMail({
  from: 'tatbib34@gmail.com',
  to: req.body.email,
  subject: "Appointment Reminder",
  html: `<div className="email" style="
  border: 4px solid orange;
  padding: 20px;
  font-family: sans-serif;
  line-height: 2;
  font-size: 22px;
  text-align: center; 
  color:red;
  ">
  <h2>Your appointment is near</h2>
  <h4>Please don't forget that </h4>
  <h4>date && time: ${req.body.dateTime}</h4>
`
})
};
//________________________updating Appointment ____________________




const updateAppointment = (req, res) => {
  // Find RendezVous By ID and update it
  Appointment.updateOne(
                   {_id: req.params.id},
                    {
                      dateTime : req.body.dateTime,
                      status : req.body.status
                    }
                  )
  .then(() => res.status(201).json("Appointment updated successfully"))
  .catch((err) => res.status(400).json("Error :" + err));

};
 //-------------------------delete Appointment-----------------------------   

 const deleteAppointment = (req, res) => {
  const {id} = req.params;
  Appointment.findOneAndDelete({_id: id})
      .then(Appointment => {
          if(!Appointment) {
            res.status(404).json({
              message: "Does Not exist Appointment with id = " + id,
              error: "404",
            });
          }
          res.status(200).json({});
      }).catch(err => {
          return res.status(500).send({
            message: "Error -> Can NOT delete a Appointment with id = " + id,
            error: err.message
          });
      });
};


module.exports={
   loginSecretary,logout,confirmAppointment,updateAppointment,deleteAppointment,alertAppointment
};
