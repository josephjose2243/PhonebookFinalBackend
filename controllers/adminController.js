// File: controllers/authController.js
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const Admin = require('../models/adminModel');
// new
// Admin Login (Updated to set isOnline true)
// Admin Login (Updated to set isOnline true and return admin name)
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    admin.isOnline = true;
    await admin.save();

    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET);
    
    // Include admin's name in the response
    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin Logout (sets isOnline false)
exports.adminLogout = async (req, res) => {
  try {
    const adminId = req.user.id;
    await Admin.findByIdAndUpdate(adminId, { isOnline: false });
    res.status(200).json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ message: "Logout error" });
  }
};

// User Login (Updated to set isOnline true)
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    user.isOnline = true;
    await user.save();

    const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET);
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// User Logout (sets isOnline false)
exports.userLogout = async (req, res) => {
  try {
    const userId = req.user.id;
    await User.findByIdAndUpdate(userId, { isOnline: false });
    res.status(200).json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ message: "Logout error" });
  }
};

// Get Current Admin (with token validation)
exports.getCurrentAdmin = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json(admin);
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
