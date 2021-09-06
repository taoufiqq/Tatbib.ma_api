const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Patient = new Schema(
{
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: String,
        required: true,
        trim: true,
    },
    telephone: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    login: {
        type: String,
        required: true,
        trim: true,
    },
    status : {
        type : String,
        required : true,
        trim : true,
    },
    role : {
        type : String,
        required : true,
        trim : true,
    },
    verified : {
        type : Boolean,
        required : true,
        trim : true,
    }
},
 {
    versionKey: false
});


const PatientList = mongoose.model("Patient",Patient);
module.exports=PatientList;