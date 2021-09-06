const express = require('express');
const router = express.Router();
const RendezVousController = require('../controllers/RendezVous.controller');

router.get('/getAllRendezVous',RendezVousController.getAllRendezVous);

module.exports = router;
