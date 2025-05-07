const express = require('express');
const router = express.Router();
const authController=require('../controllers/authController')
const {registerUser}= require('../controllers/userAuthController')
// Register route (for admin or user)
router.post('/register', authController.register);

// Login route (for admin or user)
router.post('/login', authController.login);

// Logout route
router.post('/logout', authController.logout)


// POST /api/users/register
router.post('/register', registerUser);

// Route to get all users
// router.get('/allusers', authController.getAllUsers);

module.exports = router;