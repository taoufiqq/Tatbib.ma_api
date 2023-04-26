const express = require('express');
const app = express();
var cors = require('cors');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');



const port = process.env.PORT || 3030;
// const logger = require('./config/logger')

// app.use(
//   cors({
//     origin: ['https://app-tatbib.herokuapp.com','https://tatbib.vercel.app'],
//     credentials: true,
//   })
// );


// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// parse requests of content-type - application/json
app.use(bodyParser.json());




// mongoose.connect('mongodb+srv://tatbib:x7u2Tv3qRGAZqI8n@cluster0.fkjkw.mongodb.net/Tatbib?retryWrites=true&w=majority' , {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
// //   logger.info("Successfully connected to the database");    
//   console.log("Successfully connected to the database")
// }).catch(err => {
// //   logWinston.error('Could not connect to the database. Exiting now...', err);
// //   logger.exit();
//   console.log("ERROR database",err)
// });
mongoose.connect("mongodb+srv://tatbib:x7u2Tv3qRGAZqI8n@cluster0.fkjkw.mongodb.net/Tatbib?retryWrites=true&w=majority'",{useNewUrlParser:true,useUnifiedTopology: true});

mongoose.connection.on("connected",()=>{
console.log("Mongoose connected");
})














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
