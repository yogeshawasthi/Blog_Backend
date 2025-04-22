import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res
            .status(400)
            .json({ message: "Name, email, and password are required!" });
    }
    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use!" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
        });
        await newUser.save();
    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
}
};

// Login User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
        return res
            .status(400)
            .json({ message: "Email and password are required!" });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }

        // Compare the password with the hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_TOKEN, // Ensure this is defined in your .env file
            { expiresIn: "1h" }
        );

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000, // 1 hour
        });

        // Exclude password from user data
        const { password: _, ...userData } = user.toObject();

        // Send response with token and user data
        res.status(200).json({
            message: "Login successful!",
            token, // Include the token in the response
            user: userData,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};