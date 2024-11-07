const { v4: uuidv4 } = require('uuid');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../db'); // Assuming db.js exports a MySQL connection
require('dotenv').config();  // Load environment variables
const JWT_SECRET = 'kedar'
// Registration Route (Signup)
const otpGenerator = require('otp-generator')
router.post('/signup', async (req, res) => {
    const {name, email, password, role } = req.body;

    try {

        //email verification 

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        let info=await transporter.sendMail({
            from:`kdwce2022@gmail.com`,
            to:email,
            subject:"Verify your Email",
            html:`<h1>Hello friend </h1> <p>otp for email verification is : 
            ${otp}  </p>`
        })
        console.log(info);

        // Check if user already exists
        connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Error checking existing user', error });
            }
            if (results.length > 0) {
                return res.status(400).json({ message: 'User already exists' });
            }
            



            

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            
            connection.query(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, role],
                (insertError) => {
                    if (insertError) {
                        return res.status(500).json({ message: 'Error registering user', insertError });
                    }
                    return res.status(200).json({ message: 'User registered successfully' });
                }
            );
            
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error during signup process', error });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Error fetching user data', error });
            }
            if (results.length === 0) {
                return res.status(400).json({ message: 'User not found' });
            }

            const user = results[0];

            // Compare provided password with the stored hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate a JWT token
            const token = jwt.sign(
                { id: user.id, role: user.role },  // Include user ID and role in the token
                JWT_SECRET,                       // Use the hardcoded JWT secret
                { expiresIn: '2h' }              // Token expiration time
            );

            // Return the token and user information
            return res.status(200).json({
                message: 'Login successful',
                token,
                user: { id: user.id, name: user.name, email: user.email, role: user.role },
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Login failed', error });
    }
});

module.exports = router;

//gender , state, carrier, skills(array), interest (array), username -> profile table 
//cloudinary -> resume, profile img, 


