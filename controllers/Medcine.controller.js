const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt_decode = require("jwt-decode");
const crypto = require('crypto');
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
  console.log("Received request with params:", req.params);
  console.log("Looking for loginMedcine:", req.params.loginMedcine);

  Secretary.find({
    loginMedcine: req.params.loginMedcine,
  })
    .then((secretaries) => {
      console.log("Found secretaries:", secretaries);
      res.send(secretaries);
    })
    .catch((err) => {
      console.error("Error finding secretaries:", err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving secretaries.",
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
// const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     // Find the medicine with this email
//     const medicine = await Medicine.findOne({ email: email });

//     if (!medicine) {
//       // For security reasons, don't reveal that the email doesn't exist
//       return res.status(200).json({
//         message: "If this email is registered, password reset instructions will be sent."
//       });
//     }

//     // Generate reset token
//     const resetToken = crypto.randomBytes(32).toString('hex');
//     const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

//     // Save token and expiration to medicine document
//     medicine.resetToken = hashedToken;
//     medicine.resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour
//     await medicine.save();

//     // Create reset URL
//     const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000/'}/reset-password/${resetToken}`;

//     // Email setup
//     const transporter = nodemailer.createTransport({
//       service: process.env.EMAIL_SERVICE || 'gmail',
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     // Email message
//     const mailOptions = {
//       from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
//       to: medicine.email,
//       subject: 'Password Reset Request',
//       html: `
//         <h1>You requested a password reset</h1>
//         <p>Please click on the following link to reset your password:</p>
//         <a href="${resetUrl}" target="_blank">Reset Password</a>
//         <p>This link will expire in 1 hour.</p>
//         <p>If you didn't request this, please ignore this email.</p>
//       `,
//     };

//     // Send email
//     await transporter.sendMail(mailOptions);

//     res.status(200).json({
//       message: "Password reset instructions have been sent to your email."
//     });

//   } catch (error) {
//     console.error('Forgot password error:', error);
//     res.status(500).json({
//       message: "An error occurred while processing your request.",
//       error: error.message
//     });
//   }
// };
// Reset password with token

const forgotPassword = async (req, res) => {
  try {
    console.log("Forgot password request received for:", req.body.email);

    const { email } = req.body;

    if (!email) {
      console.log("Email missing in request");
      return res.status(400).json({ message: "Email is required" });
    }

    console.log("Checking for medicine with email:", email);
    const medicine = await Medicine.findOne({ email: email });

    if (!medicine) {
      console.log(
        "No medicine found with this email (intentionally not revealing)"
      );
      return res.status(200).json({
        message:
          "If this email is registered, password reset instructions will be sent.",
      });
    }

    console.log("Generating reset token for:", medicine._id);
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    medicine.resetToken = hashedToken;
    medicine.resetTokenExpiration = Date.now() + 3600000;
    await medicine.save();
    console.log("Reset token saved to database");

    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000/"
    }/reset-password/${resetToken}`;
    console.log("Reset URL:", resetUrl);

    // Verify email config exists
    if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
      console.error("Email credentials not configured!");
      throw new Error("Email service not configured");
    }

    // Create transporter with proper OAuth2 setup for Gmail
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD, // Make sure this is an App Password if using Gmail
      },
      tls: {
        rejectUnauthorized: false // Only use in development
      }
    });

    // Verify transporter before sending
    try {
      await transporter.verify();
      console.log("SMTP connection verified successfully");
    } catch (verifyError) {
      console.error("SMTP verification failed:", verifyError);
      throw new Error(`Email service verification failed: ${verifyError.message}`);
    }

    console.log("Attempting to send email to:", medicine.email);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Password Reset" <${process.env.EMAIL_USERNAME}>`,
      to: medicine.email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Please click on the button below to create a new password:</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;" target="_blank">Reset Password</a>
          </div>
          <p>This link will expire in 1 hour for security reasons.</p>
          <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
          <hr style="border: none; border-top: 1px solid #e1e1e1; margin: 20px 0;">
          <p style="color: #777; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
        </div>
      `,
      text: `You requested a password reset. Please go to the following link to reset your password: ${resetUrl}. This link will expire in 1 hour.`,
    };
    
    await transporter.sendMail(mailOptions);

    console.log("Password reset email sent successfully");
    res.status(200).json({
      message: "Password reset instructions have been sent to your email.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      message: "An error occurred while processing your request.",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
      const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: "Token and new password are required.",
      });
    }

    // Hash the token from the URL to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find medicine with this token and check if token is still valid
    const medicine = await Medicine.findOne({
      resetToken: hashedToken,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!medicine) {
      return res.status(400).json({
        message:
          "Invalid or expired token. Please request a new password reset.",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update medicine with new password and clear reset token fields
    medicine.password = hashedPassword;
    medicine.resetToken = undefined;
    medicine.resetTokenExpiration = undefined;
    await medicine.save();

    res.status(200).json({
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message: "An error occurred while resetting your password.",
      error: error.message,
    });
  }
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
  forgotPassword,
  resetPassword,
};
