const express = require('express');
const router = express.Router();
const SecretaryController = require('../controllers/Secretary.controller');

router.post('/login', SecretaryController.loginSecretary);
router.get('/logout', SecretaryController.logout);


module.exports = router;