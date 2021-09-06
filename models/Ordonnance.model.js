const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Ordonnance = new Schema(
{
    dateOrdonnance: {
        type: Date,
        required: true,
        trim: true,
    },
    medicamment: {
        type: String,
        required: true,
        trim: true,
      
    },
    rendezVous :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RendezVous'
    },

},
 {
    versionKey: false
});


const OrdonnanceList = mongoose.model("Ordonnance",Ordonnance);
module.exports=OrdonnanceList;