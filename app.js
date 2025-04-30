const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const punycode = require("punycode/");

const port = process.env.PORT || 3030;

// Correct CORS options
const corsOptions = {
  origin: ["https://tatbib-v3.vercel.app", "http://localhost:3000"],
  credentials: true,
  optionsSuccessStatus: 200, // Fix typo here
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://tatbib:x7u2Tv3qRGAZqI8n@cluster0.fkjkw.mongodb.net/Tatbib?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

// Import routers
const MedcineRoutes = require("./routes/Medcine.router");
const PatientRoutes = require("./routes/Patient.router");
const SecretaryRoutes = require("./routes/Secretary.router");
const AppointmentRoutes = require("./routes/Appointment.router");
const OrdonnanceRoutes = require("./routes/Ordonnance.router");

// Use routers
app.use("/medcine", MedcineRoutes);
app.use("/patient", PatientRoutes);
app.use("/secretary", SecretaryRoutes);
app.use("/appointment", AppointmentRoutes);
app.use("/ordonnance", OrdonnanceRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
