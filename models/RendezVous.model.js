const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RendezVous = new Schema(
{
    dateRendezVous: {
        type: Date,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        default:"Unconfirmed",
        required: true,
        trim: true,
      
    },
    patient :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    medcine :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medcine'
    },
},
 {
    versionKey: false
});


const RendezVousList = mongoose.model("RendezVous",RendezVous);
module.exports=RendezVousList;