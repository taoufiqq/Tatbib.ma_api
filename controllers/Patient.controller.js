const Patient = require('../models/Patient.model');
const Appointment = require('../models/Appointment.model')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const jwt_decode = require('jwt-decode');





//____________________________get all patients____________________________

const getAllPatient = (req, res) => {
  Patient.find()
      .then(PatientInfos => {
        res.status(200).json(PatientInfos);
      }).catch(error => {
        console.log(error);
        res.status(500).json({
          message: "Error!",
          error: error
        });
      });
  };
  
  //_______________________ Patient authentication________________________

const addPatient = async(req, res) => {

  // const existingPatient = await Patient.findOne({email : req.body.email});

  // if (existingPatient) {

  //         console.log('An account whit this email exist');
  //         return res.json({
  //                 error : error
  //         })          
  // }

  bcrypt.hash(req.body.password, 10, function(err, hashPassword) {
      if (err) {
        res.json({error : err})    
      }
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const age = req.body.age;
  const telephone = req.body.telephone;
  const email = req.body.email;
  const password = hashPassword;
  const login = req.body.login;
  const role = "Patient";
  const verified = false;    
  const PatientPush = new Patient({
    firstName,
    lastName,
    age,
    telephone,
    email,
    password, 
    login,  
    role,
    verified
  });
  PatientPush
    .save()
    .then(() => res.json("Patient authentication successfully"))
    .catch((err) => res.status(400).json("Error :" + err));
});

// ----------------------send email validation -------------------------------   
const token = jwt.sign({login: req.body.login, email : req.body.email}, 'tokenkey');

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
      subject: "Email Activated Account",
      html: `
      <h2>Please click on below link to activate your account</h2>
      <p>https://tatbib-api.herokuapp.com/patient/activateCompte/${token}</p>
  `
  })


}
  //------------------------Patient authentication---------------------
const activateComptePatient=  async(req, res) => {
  const token = req.params.token;

  jwt.verify(token, 'tokenkey');

  let decoded = await jwt_decode(token);
  let login = decoded.login;

   await Patient.findOneAndUpdate({ login: login },{verified : true});

   res.json({
           message : "ok"
   });
}

//-------------------------login Admin-----------------------------

const loginPatient = (req, res) => {

    let login = req.body.login;
    let password = req.body.password;
  
    Patient.findOne({
        login: login
      })
      .then(patient => {
  
        if (patient) {
          bcrypt.compare(password, patient.password, function (err, result) {
            if (err) {
              res.json({
                error: err
              })
            }
            if (result) {
              let token = jwt.sign({
                login: login
              }, 'tokenkey', (err, token) => {
                res.cookie("token", token)
                res.json({
                  token: token,
                  role: patient.role,
                  verified: patient.verified,
                  patient:patient,
                  id:patient._id
                })
              })
            } 
            
          })
        } else {
          res.json({
            message: 'Patient not found'
          })
        }
      }).catch((err) => res.status(400).json("Error :" + err));
  }
 

//________________________updating Patient _____________________________
const updatePatient = (req, res) => {
  // Find Product By ID and update it
  Patient.updateOne({
      _id: req.params.id
    }, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      age: req.body.age,
      telephone: req.body.telephone,
      login: req.body.login,
    })
    .then(() => res.status(201).json("Patient updated successfully"))
    .catch((err) => res.status(400).json("Error :" + err));
};
//________________________get Patient By Id _____________________________
const getPatientById = (req, res) => {
  Patient.findById(req.params.id)
      .then(Patient => {
        res.status(200).json(Patient);
      }).catch(err => {
          if(err.kind === 'ObjectId') {
              return res.status(404).send({
                  message: "Patient not found with id " + req.params.id,
                  error: err
              });                
          }
          return res.status(500).send({
              message: "Error retrieving Patient with id " + req.params.id,
              error: err
          });
      });
};

//______________________Delete Patient___________________________________ 
const deletePatient = (req, res) => {
  const {id} = req.params;
  Patient.findOneAndDelete({_id: id})
      .then(Patient => {
          if(!Patient) {
            res.status(404).json({
              message: "Does Not exist a Patient with id = ",
              error: "404",
            });
          }
          res.status(200).json({});
      }).catch(err => {
          return res.status(500).send({
            message: "Error -> Can NOT delete a Patient with id = ",
            error: err.message
          });
      });
};
//______________________Delete Appointment ___________________________________ 
const deleteAppointment = (req, res) => {
  const {id} = req.params;
  Appointment.findOneAndDelete({_id: id})
      .then(Appointment => {
          if(!Appointment) {
            res.status(404).json({
              message: "Does Not exist a Appointment with id = ",
              error: "404",
            });
          }
          res.status(200).json({});
      }).catch(err => {
          return res.status(500).send({
            message: "Error -> Can NOT delete a Appointment with id = ",
            error: err.message
          });
      });
};


  //-------------------------logout Patient and remove token-----------------------------   
  const logout = (req, res) => {
    const deconnect = res.clearCookie("token")
  
    res.json({
        message: 'Medcine is Signout !!'
    })
  }
  module.exports={
    getAllPatient,addPatient,activateComptePatient,loginPatient,updatePatient,getPatientById,deletePatient,logout,deleteAppointment
};