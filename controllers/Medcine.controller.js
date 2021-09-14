const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const jwt_decode = require('jwt-decode');

const Medcine = require('../models/Medcine.model');
const Secretary = require('../models/Secretary.model');


//______________________get all Medcine____________________
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
//______________________get all Secretary 
const getAllSecretary= (req, res) => {
  Secretary.find()
      .then(Secretary => {
            res.status(200).json(Secretary);
          }).catch(error => {
            console.log(error);
            res.status(500).json({
                message: "Error!",
                error: error
            });
          });
    };
    //______________________Delete Secretary 
const deleteSecretary = (req, res) => {
  const {id} = req.params;
  Secretary.findOneAndDelete({_id: id})
      .then(secretary => {
          if(!secretary) {
            res.status(404).json({
              message: "Does Not exist a Secretary with id = ",
              error: "404",
            });
          }
          res.status(200).json({});
      }).catch(err => {
          return res.status(500).send({
            message: "Error -> Can NOT delete a Secretary with id = ",
            error: err.message
          });
      });
};
//______________________get Medcine By Id____________________
 const getMedcineById = (req, res) => {
        Medcine.findById(req.params.id)
            .then(Medcine => {
              res.status(200).json(Medcine);
            }).catch(err => {
                if(err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "Medcine not found with id " + req.params.id,
                        error: err
                    });                
                }
                return res.status(500).send({
                    message: "Error retrieving Medcine with id " + req.params.id,
                    error: err
                });
            });
      };
//--------------------------get Secretary By Id--------------------------- 
const getSecretaryById = (req, res) => {
  Secretary.findById(req.params.id)
      .then(Secretary => {
        res.status(200).json(Secretary);
      }).catch(err => {
          if(err.kind === 'ObjectId') {
              return res.status(404).send({
                  message: "Secretary not found with id " + req.params.id,
                  error: err
              });                
          }
          return res.status(500).send({
              message: "Error retrieving Secretary with id " + req.params.id,
              error: err
          });
      });
};
//________________________Get Secretary By NameMedcine ____________________
const getSecretaryByMedcineName = (req, res) => {
  Secretary.find({
    loginMedcine: req.params.loginMedcine
    })
    .then(Secretary => {
      res.send(Secretary);
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving question."
      });
    });
};
//________________________ Add Compte Secretary _________________
const addSecretary = async(req, res) => {

  
       
  bcrypt.hash(req.body.password, 10, function(err, hashPassword) {
      if (err) {
        res.json({error : err})    
      }
  const loginMedcine = req.body.loginMedcine;
  const fullName = req.body.fullName;
  const email = req.body.email;
  const login = req.body.login;
  const password = hashPassword;
  const status = "InActive";
  const roleSecretary = "Secretary";
  const SecretaryPush = new Secretary({
    fullName,
    email,
    login,
    password,
    status,
    loginMedcine,
    roleSecretary
  });
  SecretaryPush
    .save()
    .then(() => res.json("Secretary authentication successfully  Please Wait untill Medcine ACCEPTER Your documments"))

     
    .catch((err) => res.status(400).json("Error :" + err));


});

}

 //________________________Activate Compte Secretary_________________
 const ActivateCompteSecretary = (req, res) => {
  // Find Secretary By ID and update it
  Secretary.updateOne(
                   {_id: req.params.id},
                    {
                      status : req.body.status,
                    }
                  )
  .then(() => res.status(201).json("compte Activated  successfully"))
  .catch((err) => res.status(400).json("Error :" + err));
};
 //________________________updating Medcine___________________
 const UpdateAvailablityMedcine = (req, res) => {
  // Find Medcine By ID and update it
  Medcine.updateOne(
                   {_id: req.params.id},
                    {
                      availablity : req.body.availablity,
                    }
                  )
  .then(() => res.status(201).json("availablity updated successfully"))
  .catch((err) => res.status(400).json("Error :" + err));
};
 //______________________Delete Medcine _____________________ 
     const deleteMedcine= (req, res) => {
      const {id} = req.params;
      Medcine.findOneAndDelete({_id: id})
          .then(Medcine => {
              if(!Medcine) {
                res.status(404).json({
                  message: "Does Not exist Medcine with id = " + id,
                  error: "404",
                });
              }
              res.status(200).json({});
          }).catch(err => {
              return res.status(500).send({
                message: "Error -> Can NOT delete a Medcine with id = " + id,
                error: err.message
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
        const availablity = "Available";
        const verified = false;  
        const MedcinePush = new Medcine({
          fullName,         
          email,
          login,
          password,
          speciality,  
          city,
          role,
          verified,
          availablity
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


          //   if(medcine.availablity == "NotAvailable"){
          //     res.json({
          //       availablity: 'NotAvailable'
          //       })
          // }


              let token=jwt.sign({login :login},'tokenkey',(err,token) => {
                res.cookie("token", token)  
                res.json({
                    token : token,
                    role:medcine.role,
                    verified:medcine.verified,
                    id:medcine._id,
                    medcine:medcine,
                   
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
  getAllMedcine,getMedcineById,UpdateAvailablityMedcine,getSecretaryByMedcineName,deleteSecretary,deleteMedcine,addMedcine,addSecretary,activateCompteMedcine,loginMedcine,logout,ActivateCompteSecretary,getSecretaryById,getAllSecretary
};