const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/userAuthController');

// This should match what the frontend is calling
router.post('/register', registerUser);

module.exports = router;
