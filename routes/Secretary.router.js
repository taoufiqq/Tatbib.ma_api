const express = require('express');
const router = express.Router();
const SecretaryController = require('../controllers/Secretary.controller');

router.post('/authentication', SecretaryController.addSecretary)
router.put('/activateCompte/:token', SecretaryController.activateCompteSecretary);
router.post('/login', SecretaryController.loginSecretary);
router.get('/logout', SecretaryController.logout);
router.get('/getAllSecretary',SecretaryController.getAllSecretary);

module.exports = router;