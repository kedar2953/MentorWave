const express = require('express');
const cors = require('cors');  // To allow frontend to make requests
const cookieParser = require('cookie-parser');
require('dotenv').config();  // Load environment variables

const app = express();

// console.log('DB Host:', process.env.DB_HOST);
// console.log('DB User:', process.env.DB_USER);
// console.log('DB Password:', process.env.DB_PASSWORD);
// console.log('DB Name:', process.env.DB_NAME);
// Middleware
app.use(express.json());  // Parse incoming JSON requests
app.use(cors());  // Allow cross-origin requests (adjust depending on the frontend URL)
app.use(cookieParser());  // To parse cookies (for JWT)

// Import routes
const userRoutes = require('./routes/user');

// Routes
app.use('/api/users', userRoutes);

// Error handling (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
