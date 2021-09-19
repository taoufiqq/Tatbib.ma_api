const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Appointment = new Schema(
{
    appointmentDate: {
        type: Date,
        required: true,
        trim: true,
    },
    status: {
        type: String,
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


const AppointmentList = mongoose.model("Appointment",Appointment);
module.exports=AppointmentList;