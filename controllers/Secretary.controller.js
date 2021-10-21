const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const jwt_decode = require('jwt-decode');

const Secretary = require('../models/Secretary.model');
const Appointment = require('../models/Appointment.model');
const Patient = require('../models/Patient.model');

//_______________________ Secretary authentication________________________


     
//-------------------------login Secretary-----------------------------
      
const loginSecretary= (req, res) => {
      
        let login=req.body.login;
        let password=req.body.password;
      
        Secretary.findOne({login : login})
      .then(Secretary => {
      
      if(Secretary){

        bcrypt.compare(password, Secretary.password, function(err, result){
            if (err) {
                res.json({
                  error : err
                })
              }

        if(result){

  
          if(Secretary.status == "InActive"){
            res.json({
              status: 'InActive'
              })
        }
        else if(Secretary.status == "Block"){
          res.json({
            status: 'Block'
            })
      }
        
        
        
        else {
          let tokenSecretary = jwt.sign({
            login: login
          }, 'tokenkey', (err, tokenSecretary) => {
            res.cookie("tokenSecretary", tokenSecretary)
            res.json({
                 tokenSecretary : tokenSecretary,
                 roleSecretary:Secretary.roleSecretary,
                 status:Secretary.status,
                 id:Secretary.id,
                 loginMedcine:Secretary.loginMedcine
            })
          
        })
      }


    }else {
        res.json({
          message: 'password incorrect try again !!'
        })
      }
    })
  } else {
    res.json({
      message: 'Admin not found'
    })
  }
}).catch((err) => res.status(400).json("Error :" + err));
}
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
          user: 'elhanchaoui.emailtest@gmail.com',//email
          pass: 'Taoufiq@2021'//password
        }
    })
  
     await transport.sendMail({
        from: 'elhanchaoui.emailtest@gmail.com',
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
          user: 'elhanchaoui.emailtest@gmail.com',//email
          pass: 'Taoufiq@2021'//password
        }
    })
  
     await transport.sendMail({
        from: 'elhanchaoui.emailtest@gmail.com',
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
    user: 'elhanchaoui.emailtest@gmail.com',//email
    pass: 'Taoufiq@2021'//password
  }
})

await transport.sendMail({
  from: 'elhanchaoui.emailtest@gmail.com',
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