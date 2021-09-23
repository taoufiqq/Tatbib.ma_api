const express = require('express');
const app = express();
var cors = require('cors');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');



const port = process.env.PORT || 3030;
const logger = require('./config/logger')


app.use(express.json());
app.use(cors());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// parse requests of content-type - application/json
app.use(bodyParser.json());




mongoose.connect('mongodb://localhost:27017/Tatbib' , {
  useNewUrlParser: true
}).then(() => {
  logger.info("Successfully connected to the database");    
}).catch(err => {
  logWinston.error('Could not connect to the database. Exiting now...', err);
  logger.exit();
});















// _______________import router_______________ 
const MedcineRoutes = require("./routes/Medcine.router");
const PatientRoutes = require("./routes/Patient.router");
const SecretaryRoutes = require("./routes/Secretary.router");
const AppointmentRoutes = require("./routes/Appointment.router");
const OrdonnanceRoutes = require("./routes/Ordonnance.router");

app.use('/medcine',MedcineRoutes);
app.use('/patient',PatientRoutes);
app.use('/secretary',SecretaryRoutes);
app.use('/appointment',AppointmentRoutes);
app.use('/ordonnance',OrdonnanceRoutes);
















module.exports =app;


app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
  }) 