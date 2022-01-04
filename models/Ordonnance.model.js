const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Ordonnance = new Schema(
{
    medicamment: {
        type: String,
        required: true,
        trim: true,
      
    },
    appointment :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
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


const OrdonnanceList = mongoose.model("Ordonnance",Ordonnance);
module.exports=OrdonnanceList;