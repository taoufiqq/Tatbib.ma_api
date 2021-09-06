const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

const addMedcine = (req, res) => {
       
        bcrypt.hash(req.body.password, 10, function(err, hashPassword) {
            if (err) {
              res.json({error : err})    
            }
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const login = req.body.login;
        const password = hashPassword;
        const MedcinePush = new Medcine({
          firstName,
          lastName,
          email,
          login,
          password,  
        });
        MedcinePush
          .save()
          .then(() => res.json("Medcine authentication successfully"))
          .catch((err) => res.status(400).json("Error :" + err));
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
                    token : token
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
  getAllMedcine,addMedcine,loginMedcine,logout
};