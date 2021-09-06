const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

const addSecretary = (req, res) => {
       
        bcrypt.hash(req.body.password, 10, function(err, hashPassword) {
            if (err) {
              res.json({error : err})    
            }
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const login = req.body.login;
        const password = hashPassword;
        const SecretaryPush = new Secretary({
          firstName,
          lastName,
          email,
          login,
          password,  
        });
        SecretaryPush
          .save()
          .then(() => res.json("Secretary authentication successfully"))
          .catch((err) => res.status(400).json("Error :" + err));
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
                    token : token
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
  getAllSecretary,addSecretary,loginSecretary,logout,confirmerRendezVous,updateRendezVous,deleteRendezVous
};