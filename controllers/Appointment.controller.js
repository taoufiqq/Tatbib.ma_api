const { populate } = require("../models/Appointment.model");
const Appointment = require("../models/Appointment.model");

//_______________________ get All Appointment ________________________
const getAllAppointment = (req, res) => {
  Appointment.findOne()
    .then((AppointmentInfos) => {
      res.status(200).json(AppointmentInfos);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error!",
        error: error,
      });
    });
};

//--------------------------get Appointment By Id---------------------------
const getAppointmentById = (req, res) => {
  Appointment.findById(req.params.id)
    .populate("medicine")
    .populate("patient")
    .then((Appointment) => {
      res.status(200).json(Appointment);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Appointment not found with id " + req.params.id,
          error: err,
        });
      }
      return res.status(500).send({
        message: "Error retrieving Appointment with id " + req.params.id,
        error: err,
      });
    });
};
// ----------------- add Appointment --------------------

const addAppointment = async (req, res) => {
  const dateTime = req.body.dateTime;
  const status = "Pending";
  const patient = req.body.patient;
  const medicine = req.body.medicine; // ⚡ Correct here

  const loginMedcine = req.body.loginMedcine;

  const existingAppointment = await Appointment.findOne({
    medicine: medicine,
    dateTime: dateTime,
  });

  if (existingAppointment) {
    return res.json({ error: true });
  }

  const appointmentPush = new Appointment({
    dateTime,
    status,
    patient,
    medicine, // ⚡ Correct here
    loginMedcine,
  });

  let result = await appointmentPush.save();
  res.send(result);
};

// -------------------------- get Appointment Patient ---------------------------
const getAppointmentPatient = (req, res) => {
  Appointment.find({ patient: req.params.id })
    .populate("medicine") // Populate the medicine field
    .populate("patient")
    .sort({ dateTime: 1 }) // 1 for ascending order, -1 for descending order
    .then((appointments) => {
      res.status(200).json(appointments);
    })
    .catch((err) => {
      console.error(err); // Always log the error for debugging
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Appointment not found with id " + req.params.id,
          error: err,
        });
      }
      return res.status(500).send({
        message: "Error retrieving Appointment with id " + req.params.id,
        error: err,
      });
    });
};

// -------------------------- get Appointment Medcine ---------------------------
const getAppointmentMedcine = async (req, res) => {
  try {
    const appointments = await Appointment.find({ medicine: req.params.id }) // FIXED HERE
      .populate({
        path: "patient",
        select: "_id lastName firstName email telephone",
      })
      .populate({
        path: "medicine",
        select: "_id name", // Optional: you can also add description, etc.
      })
      .sort({ dateTime: 1 })
      .lean();

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No appointments found for medicine with id ${req.params.id}`,
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (err) {
    console.error("Error in getAppointmentMedicine:", err);

    if (err.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine ID format",
        error: err.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while retrieving appointments",
      error: err.message,
    });
  }
};

// -------------------------- get Appointment to Secretary ---------------------------
// const getAppointmentSecretary = async (req, res) => {
//   try {
//     const appointments = await Appointment.find({
//       loginMedcine: req.params.loginMedcine,
//     })
//       .populate({
//         path: "patient",
//         select: "_id lastName firstName email telephone",
//       })
//       .populate({
//         path: "medicine",
//         select: "_id name",
//       })
//       .sort({ dateTime: 1 })
//       .lean();

//     if (!appointments || appointments.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: `No appointments found for doctor with login ${req.params.loginMedcine}`,
//         data: [],
//       });
//     }

//     res.status(200).json({
//       success: true,
//       count: appointments.length,
//       data: appointments,
//     });
//   } catch (err) {
//     console.error("Error in getAppointmentSecretary:", err);

//     if (err.kind === "ObjectId") {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid login format",
//         error: err.message,
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: "Server error while retrieving secretary appointments",
//       error: err.message,
//     });
//   }
// };
const getAppointmentSecretary = (req, res) => {
  Appointment.find({ loginMedcine: req.params.loginMedcine })
    .populate("patient")
    .populate("medicine")
    .sort({ dateTime: 1 })
    .lean()
    .then((appointment) => {
      res.status(200).json(appointment);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Appointment not found with id " + req.params.id,
          error: err,
        });
      }
      return res.status(500).send({
        message: "Error retrieving Appointment with id " + req.params.id,
        error: err,
      });
    });
};

module.exports = {
  getAllAppointment,
  addAppointment,
  getAppointmentPatient,
  getAppointmentSecretary,
  getAppointmentById,
  getAppointmentMedcine,
};
