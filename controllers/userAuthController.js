const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// Register User
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const name = `${firstName} ${lastName}`;

    // Create new user with role: 'user'
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'user', // Explicitly set role
      status: 'Offline',
      isOnline: false
    });

    await newUser.save();

    res.status(201).json({ message: `User registered successfully with name ${name}` });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "Something went wrong during registration", error: error.message });
  }
};

module.exports = { registerUser };
