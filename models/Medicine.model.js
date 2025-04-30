const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Medicine = new Schema(
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

    speciality: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    // verified : {
    //     type : Boolean,
    //     required : true,
    //     trim : true,
    // },
    availability: {
      type: String,
      required: true,
      trim: true,
    },
    resetToken: String,
    resetTokenExpiration: Date,
  },
  {
    versionKey: false,
  }
);

const MedicineList = mongoose.model("Medicine", Medicine);
module.exports = MedicineList;
