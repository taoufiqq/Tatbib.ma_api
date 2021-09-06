const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Secretary = new Schema(
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

const SecretaryList = mongoose.model("Secretary",Secretary);
module.exports=SecretaryList;