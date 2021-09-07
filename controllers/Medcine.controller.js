const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const jwt_decode = require('jwt-decode');

const Medcine = require('../models/Medcine.model');


//______________________get all Medcine 
const getAllMedcine= (req, res) => {
  Medcine.find()
        .then(Medcine => {
              res.status(200).json(Medcine);
            }).catch(error => {
              console.log(error);
              res.status(500).json({
                  message: "Error!",
                  error: error
              });
            });
      };
//_______________________ Medcine authentication________________________

const addMedcine = async(req, res) => {
       
        bcrypt.hash(req.body.password, 10, function(err, hashPassword) {
            if (err) {
              res.json({error : err})    
            }
        const fullName = req.body.fullName;   
        const email = req.body.email;
        const login = req.body.login;
        const password = hashPassword;
        const speciality = req.body.speciality;
        const city = req.body.city;
        const role = "Medcine";
        const verified = false;  
        const MedcinePush = new Medcine({
          fullName,         
          email,
          login,
          password,
          speciality,  
          city,
          role,
          verified
        });
        MedcinePush
          .save()
          .then(() => res.json("Medcine authentication successfully"))
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
      <p>http://localhost:3000/medcine/activateCompte/${token}</p>
  `
  })
}
  //------------------------Medcine authentication---------------------
  const activateCompteMedcine=  async(req, res) => {
    const token = req.params.token;
  
    jwt.verify(token, 'tokenkey');
  
    let decoded = await jwt_decode(token);
    let login = decoded.login;
  
     await Medcine.findOneAndUpdate({ login: login },{verified : true});
  
     res.json({
             message : "ok"
     });
  }
  
      
      //-------------------------login Medcine-----------------------------
      
      const loginMedcine= (req, res) => {
      
        let login=req.body.login;
        let password=req.body.password;
      
        Medcine.findOne({login : login})
      .then(medcine => {
      
      if(medcine){
        bcrypt.compare(password, medcine.password, function(err, result){
            if (err) {
                res.json({
                  error : err
                })
              }
           if(result){
              let token=jwt.sign({login :login},'tokenkey',(err,token) => {
                res.cookie("token", token)  
                res.json({
                    token : token,
                    role:medcine.role,
                    verified:medcine.verified
                })
              })
           }
           
        })
      }else{
        res.json({
            message : 'Medcine not found'
        })
      }
      }).catch((err) => res.status(400).json("Error :" + err));
      }

 //-------------------------logout Medcine and remove token-----------------------------   
     const logout = (req, res) => {
        const deconnect = res.clearCookie("token")
      
        res.json({
            message: 'Medcine is Signout !!'
        })
      }
      



module.exports={
  getAllMedcine,addMedcine,activateCompteMedcine,loginMedcine,logout
};