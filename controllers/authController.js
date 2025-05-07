const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const name = `${firstName} ${lastName}`;  // Combine firstName and lastName into a name

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      status: 'Offline',
      isOnline: false
    });

    await newUser.save();

    res.status(201).json({ message: `User registered successfully with name ${name}` });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Something went wrong during registration", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    existingUser.status = 'Online';
    existingUser.isOnline = true;
    await existingUser.save();

    const token = jwt.sign(
      { id: existingUser._id, role: existingUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: existingUser._id,
        name: `${existingUser.firstName} ${existingUser.lastName}`,  // Combine firstName and lastName
        role: existingUser.role,
        status: existingUser.status,
      }
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Something went wrong during login", error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (user) {
      user.status = 'Offline';
      user.isOnline = false;
      await user.save();
    }

    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
};

module.exports = {
  register,
  login,
  logout
};
