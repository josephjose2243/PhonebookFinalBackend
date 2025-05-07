const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');  // Using require for the database connection
const authRoutes = require('./routes/authRoutes');  // Require auth routes
const contactRoutes = require('./routes/contactRoutes');  // Require contact routes
const errorHandler = require('./middleware/errorHandler');  // Require error handler middleware
const userRoutes = require('./routes/userRoutes');  // ✅ Add this line


dotenv.config();  // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);  // Use for contact routes
app.use('/auth', authRoutes);  // Define another route as needed
app.use('/api/users', userRoutes);


// Custom Error Handler
app.use(errorHandler);

// Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
