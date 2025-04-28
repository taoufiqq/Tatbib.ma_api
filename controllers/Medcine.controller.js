const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt_decode = require("jwt-decode");
const { validationResult } = require("express-validator");
const Medicine = require("../models/Medicine.model");
const Secretary = require("../models/Secretary.model");
const Ordonnance = require("../models/Ordonnance.model");

//______________________get all Medcine____________________
const getAllMedcine = (req, res) => {
  Medicine.find() // Ensure you're using the correct model name here
    .then((medicines) => {
      // Fix variable to reflect the correct data
      res.status(200).json(medicines);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error retrieving medicines.",
        error: error,
      });
    });
};

//______________________get all Secretary
const getAllSecretary = (req, res) => {
  Secretary.find()
    .then((Secretary) => {
      res.status(200).json(Secretary);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error!",
        error: error,
      });
    });
};
//______________________Delete Secretary
const deleteSecretary = (req, res) => {
  const { id } = req.params;
  Secretary.findOneAndDelete({ _id: id })
    .then((secretary) => {
      if (!secretary) {
        res.status(404).json({
          message: "Does Not exist a Secretary with id = ",
          error: "404",
        });
      }
      res.status(200).json({});
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error -> Can NOT delete a Secretary with id = ",
        error: err.message,
      });
    });
};
//______________________get Medcine By Id____________________
const getMedcineById = (req, res) => {
  Medicine.findById(req.params.id)
    .then((medicine) => {
      if (!medicine) {
        return res.status(404).json({ message: "Medicine not found" });
      }
      res.status(200).json(medicine);
    })
    .catch((err) => {
      console.error(err);
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Medicine not found with id " + req.params.id,
          error: err,
        });
      }
      return res.status(500).send({
        message: "Error retrieving Medicine with id " + req.params.id,
        error: err,
      });
    });
};

//--------------------------get Secretary By Id---------------------------
const getSecretaryById = (req, res) => {
  Secretary.findById(req.params.id)
    .then((Secretary) => {
      res.status(200).json(Secretary);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Secretary not found with id " + req.params.id,
          error: err,
        });
      }
      return res.status(500).send({
        message: "Error retrieving Secretary with id " + req.params.id,
        error: err,
      });
    });
};
//________________________Get Secretary By NameMedcine ____________________
const getSecretaryByMedcineName = (req, res) => {
  Secretary.find({
    loginMedcine: req.params.loginMedcine,
  })
    .then((Secretary) => {
      res.send(Secretary);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving question.",
      });
    });
};
//________________________ Add Compte Secretary _________________
const addSecretary = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { loginMedcine, fullName, email, login, password } = req.body;

    // Check if secretary already exists
    const existingSecretary = await Secretary.findOne({
      $or: [{ email }, { login }],
    });
    if (existingSecretary) {
      return res
        .status(400)
        .json({ message: "Secretary with this email or login already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newSecretary = new Secretary({
      fullName,
      email,
      login,
      password: hashedPassword,
      status: "InActive",
      loginMedcine,
      roleSecretary: "Secretary",
    });

    await newSecretary.save();

    res.status(201).json({
      success: true,
      message:
        "Secretary account created successfully. Please wait for doctor approval.",
    });
  } catch (error) {
    console.error("Error creating secretary account:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating secretary account",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

//________________________Activate Compte Secretary_________________
const ManageSecretaryAccount = (req, res) => {
  // Find Secretary By ID and update it
  Secretary.updateOne({ _id: req.params.id }, { status: req.body.status })
    .then(() => {
      // Check if status is 'Blocked' and send logout required flag
      if (req.body.status === "Blocked") {
        return res.status(200).json({
          message: "Account has been blocked successfully",
          logoutRequired: true, // This will signal the frontend to log the user out
        });
      }

      res.status(201).json("Account activated successfully");
    })
    .catch((err) => {
      res.status(400).json("Error: " + err);
    });
};

//________________________updating Medcine___________________
const UpdateAvailabilityMedicine = (req, res) => {
  // Find Medcine By ID and update it
  Medicine.updateOne(
    { _id: req.params.id },
    {
      availability: req.body.availability,
    }
  )
    .then(() => res.status(201).json("availability updated successfully"))
    .catch((err) => res.status(400).json("Error :" + err));
};
//______________________Delete Medcine _____________________
const deleteMedcine = (req, res) => {
  const { id } = req.params;
  Medicine.findOneAndDelete({ _id: id })
    .then((Medcine) => {
      if (!Medcine) {
        res.status(404).json({
          message: "Does Not exist Medcine with id = " + id,
          error: "404",
        });
      }
      res.status(200).json({});
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error -> Can NOT delete a Medcine with id = " + id,
        error: err.message,
      });
    });
};

//_______________________ Medcine authentication________________________
const addMedcine = async (req, res) => {
  bcrypt.hash(req.body.password, 10, function (err, hashPassword) {
    if (err) {
      res.json({ error: err });
    }
    const fullName = req.body.fullName;
    const email = req.body.email;
    const login = req.body.login;
    const password = hashPassword;
    const speciality = req.body.speciality;
    const city = req.body.city;
    const role = "medicine";
    const availability = "Available";
    // const verified = false;
    const MedicinePush = new Medicine({
      fullName,
      email,
      login,
      password,
      speciality,
      city,
      role,
      // verified,
      availability,
    });
    MedicinePush.save()
      .then(() => res.json("Medcine authentication successfully"))
      .catch((err) => res.status(400).json("Error :" + err));
  });
  // ----------------------send email validation -------------------------------
  // const token = jwt.sign({login: req.body.login, email : req.body.email}, 'tokenkey');

  // const transport = nodemailer.createTransport({
  //   service: "gmail",
  //       auth: {
  //         user: 'tatbib34@gmail.com',//email
  //         pass: 'youcode2020'//password
  //       }
  //   })

  //   await transport.sendMail({
  //       from: 'tatbib34@gmail.com',
  //       to: req.body.email,
  //       subject: "Email Activated Account",
  //       html: `
  //       <h2>Please click on below link to activate your account</h2>
  //       <p>https://tatbib.vercel.app/medcine/activateCompte/${token}</p>
  //   `
  //   })
};

//------------------------Medcine authentication---------------------
// const activateCompteMedcine=  async(req, res) => {
//   const token = req.params.token;

//   jwt.verify(token, 'tokenkey');

//   let decoded = await jwt_decode(token);
//   let login = decoded.login;

//    await Medcine.findOneAndUpdate({ login: login },{verified : true});

//    res.json({
//            message : "ok"
//    });
// }

//-------------------------login Medcine-----------------------------

const loginMedcine = (req, res) => {
  let login = req.body.login;
  let password = req.body.password;

  Medicine.findOne({ login: login })
    .then((medicine) => {
      if (medicine) {
        bcrypt.compare(password, medicine.password, function (err, result) {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          }
          if (result) {
            let token = jwt.sign({ login: login }, "tokenkey", (err, token) => {
              if (err) {
                return res.status(500).json({
                  error: "Failed to generate token",
                });
              }

              // Normalize the role before sending
              const normalizedRole =
                medicine.role.toLowerCase() === "medcine"
                  ? "medicine"
                  : medicine.role.toLowerCase();

              res.json({
                token: token,
                role: normalizedRole, // Send normalized role
                id: medicine._id,
                medicine: medicine,
                verified: medicine.verified,
              });
            });
          } else {
            res.status(401).json({
              message: "Password incorrect. Please try again!",
            });
          }
        });
      } else {
        res.status(404).json({
          message: "Doctor not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
};
//-------------------------logout Medcine and remove token-----------------------------
const logout = (req, res) => {
  const deconnect = res.clearCookie("token");

  res.json({
    message: "Medcine is Signout !!",
  });
};

//________________________Get Medcine  By speciality ____________________
const getMedcineBySpeciality = (req, res) => {
  // let speciality=req.params.speciality;
  Medicine.find({
    speciality: req.params.speciality,
  })
    .then((medicine) => {
      res.send(medicine);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving question.",
      });
    });
};

// -------------------------- add Ordonnance---------------------------
const addOrdonnance = async (req, res) => {
  const dateTime = req.body.dateTime;
  const medicamment = req.body.medicamment;
  const patient = req.body.patient;
  const medcine = req.body.medcine;
  const appointment = req.body.appointment;

  const OrdonnancePush = new Ordonnance({
    dateTime,
    medicamment,
    patient,
    medcine,
    appointment,
  });
  let result = await OrdonnancePush.save();
  res.send(result);
};
const getAllOrdonnance = (req, res) => {
  Ordonnance.find()
    .then((OrdonnanceInfos) => {
      res.status(200).json(OrdonnanceInfos);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error!",
        error: error,
      });
    });
};
// -------------------------- get Ordonnance By Medcine ---------------------------
const getOrdonnanceByMedcine = (req, res) => {
  Ordonnance.find({ medcine: req.params.id })
    .populate("patient")
    .populate("medcine")
    .then((Ordonnance) => {
      res.status(200).json(Ordonnance);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Ordonnance not found with id " + req.params.id,
          error: err,
        });
      }
      return res.status(500).send({
        message: "Error retrieving Ordonnance with id " + req.params.id,
        error: err,
      });
    });
};
// -------------------------- get Ordonnance By Patient ---------------------------
const getOrdonnanceByPatient = (req, res) => {
  Ordonnance.find({ patient: req.params.id })
    .populate("patient")
    .populate("medcine")
    .then((Ordonnance) => {
      res.status(200).json(Ordonnance);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Ordonnance not found with id " + req.params.id,
          error: err,
        });
      }
      return res.status(500).send({
        message: "Error retrieving Ordonnance with id " + req.params.id,
        error: err,
      });
    });
};
module.exports = {
  addOrdonnance,
  getAllOrdonnance,
  getOrdonnanceByMedcine,
  getOrdonnanceByPatient,
  getAllMedcine,
  getMedcineById,
  UpdateAvailabilityMedicine,
  getSecretaryByMedcineName,
  deleteSecretary,
  deleteMedcine,
  addMedcine,
  addSecretary,
  loginMedcine,
  logout,
  ManageSecretaryAccount,
  getSecretaryById,
  getAllSecretary,
  getMedcineBySpeciality,
};
