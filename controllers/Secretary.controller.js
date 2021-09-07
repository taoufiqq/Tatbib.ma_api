const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const jwt_decode = require('jwt-decode');

const Secretary = require('../models/Secretary.model');
const RendezVous = require('../models/RendezVous.model');

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
//_______________________ Secretary authentication________________________

const addSecretary = async(req, res) => {
       
        bcrypt.hash(req.body.password, 10, function(err, hashPassword) {
            if (err) {
              res.json({error : err})    
            }
        const fullName = req.body.fullName;
        const email = req.body.email;
        const login = req.body.login;
        const password = hashPassword;
        const status = "InActive";
        const role = "Secretary";
        const verified = false;  
        const SecretaryPush = new Secretary({
          fullName,
          email,
          login,
          password,
          status,
          role,
          verified  
        });
        SecretaryPush
          .save()
          .then(() => res.json("Secretary authentication successfully  Please Wait untill Medcine ACCEPTER Your documments"))
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
      <p>http://localhost:3000/secretary/activateCompte/${token}</p>
  `
  })
}
   //------------------------Medcine authentication---------------------
   const activateCompteSecretary=  async(req, res) => {
    const token = req.params.token;
  
    jwt.verify(token, 'tokenkey');
  
    let decoded = await jwt_decode(token);
    let login = decoded.login;
  
     await Secretary.findOneAndUpdate({ login: login },{verified : true});
  
     res.json({
             message : "ok"
     });
  }     
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
              let token=jwt.sign({login :login},'tokenkey',(err,token) => {
                res.cookie("token", token)  
                res.json({
                    token : token,
                    role:Secretary.role,
                    verified:Secretary.verified
                })
              })
           }
           
        })
      }else{
        res.json({
            message : 'Secretary not found'
        })
      }
      }).catch((err) => res.status(400).json("Error :" + err));
      }

 //-------------------------logout Secretary and remove token-----------------------------   
     const logout = (req, res) => {
        const deconnect = res.clearCookie("token")
      
        res.json({
            message: 'Secretary is Signout !!'
        })
      }
      
      const confirmerRendezVous = (req, res) => {
        // Find RendezVous By ID and update it
        RendezVous.updateOne(
                         {_id: req.params.id},
                          {
                            status : req.body.status,
                          }
                        )
        .then(() => res.status(201).json("RendezVous updated successfully"))
        .catch((err) => res.status(400).json("Error :" + err));
      };



//________________________updating RendezVous ____________________




const updateRendezVous = (req, res) => {
  // Find RendezVous By ID and update it
  RendezVous.updateOne(
                   {_id: req.params.id},
                    {
                      dateRendezVous : req.body.dateRendezVous,
                      status : req.body.status
                    }
                  )
  .then(() => res.status(201).json("RendezVous updated successfully"))
  .catch((err) => res.status(400).json("Error :" + err));
};
 //-------------------------delete RendezVous-----------------------------   

 const deleteRendezVous = (req, res) => {
  const {id} = req.params;
  RendezVous.findOneAndDelete({_id: id})
      .then(RendezVous => {
          if(!RendezVous) {
            res.status(404).json({
              message: "Does Not exist RendezVous with id = " + id,
              error: "404",
            });
          }
          res.status(200).json({});
      }).catch(err => {
          return res.status(500).send({
            message: "Error -> Can NOT delete a RendezVous with id = " + id,
            error: err.message
          });
      });
};


module.exports={
  getAllSecretary,addSecretary,activateCompteSecretary,loginSecretary,logout,confirmerRendezVous,updateRendezVous,deleteRendezVous
};