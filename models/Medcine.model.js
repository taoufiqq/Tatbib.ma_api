const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Medcine = new Schema(
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
},
 {
    versionKey: false
});

const MedcineList = mongoose.model("Medcine",Medcine);
module.exports=MedcineList;