const express = require('express');
const router = express.Router();
const SecretaryController = require('../controllers/Secretary.controller');

router.get('/authentication', SecretaryController.addSecretary)
router.post('/login', SecretaryController.loginSecretary);
router.get('/logout', SecretaryController.logout);
router.get('/getAllSecretary',SecretaryController.getAllSecretary);

module.exports = router;