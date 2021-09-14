const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Secretary = new Schema(
{
    id_medcine:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Medcine'
      },
      loginMedcine: {
        type: String,
        required: true,
        trim: true,
    },
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
    status: {
        type: String,
        required: true,
        trim: true,
    },
    roleSecretary : {
        type : String,
        required : true,
        trim : true,
    },
},
 {
    versionKey: false
});

const SecretaryList = mongoose.model("Secretary",Secretary);
module.exports=SecretaryList;