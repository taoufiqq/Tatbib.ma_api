const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Medcine = new Schema(
{

    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    login: {
        type: String,
        required: true,
        trim: true,
        
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    speciality : {
        type : String,
        required : true,
        trim : true,
    },
    role : {
        type : String,
        required : true,
        trim : true,
    },
    city : {
        type : String,
        required : true,
        trim : true,
    },
    // verified : {
    //     type : Boolean,
    //     required : true,
    //     trim : true,
    // },
    availablity : {
        type : String,
        required : true,
        trim : true,
    },
},
 {
    versionKey: false
});

const MedcineList = mongoose.model("Medcine",Medcine);
module.exports=MedcineList;