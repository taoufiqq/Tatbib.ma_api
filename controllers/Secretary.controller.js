const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const jwt_decode = require('jwt-decode');

const Secretary = require('../models/Secretary.model');
const Appointment = require('../models/Appointment.model');


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
      const confirmAppointment = (req, res) => {
        // Find RendezVous By ID and update it
        Appointment.updateOne(
                         {_id: req.params.id},
                          {
                            status : req.body.status,
                          }
                        )
        .then(() => res.status(201).json("Appointment updated successfully"))
        .catch((err) => res.status(400).json("Error :" + err));
      };
//________________________updating Appointment ____________________




const updateAppointment = (req, res) => {
  // Find RendezVous By ID and update it
  Appointment.updateOne(
                   {_id: req.params.id},
                    {
                      date : req.body.date,
                      time : req.body.time,
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
   loginSecretary,logout,confirmAppointment,updateAppointment,deleteAppointment
};