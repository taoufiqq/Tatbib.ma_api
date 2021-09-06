const Patient = require('../models/Patient.model');
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
  const status = "InValide";
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
    status,
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
      <p>http://localhost:3000/patient/activateCompte/${token}</p>
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
                  verified: patient.verified
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
 
  //-------------------------logout Patient and remove token-----------------------------   
  const logout = (req, res) => {
    const deconnect = res.clearCookie("token")
  
    res.json({
        message: 'Medcine is Signout !!'
    })
  }
  module.exports={
    getAllPatient,addPatient,activateComptePatient,loginPatient,logout
};