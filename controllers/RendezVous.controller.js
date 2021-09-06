const RendezVous = require('../models/RendezVous.model');


//_______________________ get All RendezVous ________________________
const getAllRendezVous = (req, res) => {
    RendezVous.find()
        .then(RendezVousInfos => {
          res.status(200).json(RendezVousInfos);
        }).catch(error => {
          console.log(error);
          res.status(500).json({
            message: "Error!",
            error: error
          });
        });
    };

 














module.exports={
        getAllRendezVous
    };