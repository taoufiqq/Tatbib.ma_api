const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const jwt_decode = require('jwt-decode');

const Secretary = require('../models/Secretary.model');
const RendezVous = require('../models/RendezVous.model');


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
        const SecretaryPush = new Secretary({
          fullName,
          email,
          login,
          password,
          status,
          role
        });
        SecretaryPush
          .save()
          .then(() => res.json("Secretary authentication successfully  Please Wait untill Medcine ACCEPTER Your documments"))
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
          let token = jwt.sign({
            login: login
          }, 'tokenkey', (err, token) => {
            res.cookie("token", token)
            res.json({
                 token : token,
                 role:Secretary.role,
                 status:Secretary.status,
                 id:Secretary.id
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
  addSecretary,loginSecretary,logout,confirmerRendezVous,updateRendezVous,deleteRendezVous
};