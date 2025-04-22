import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Register User
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    // Validate input fields
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already has an account" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error during user registration:", error);
        return res.status(500).json({ message: "An error occurred during registration" });
    }
};

export const loginuser = async (req, res) => {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide both email and password" });
    }

    try {
        // Check if JWT secret is defined
        if (!process.env.JWT_TOKEN) {
            return res.status(500).json({ message: "JWT secret is not defined in environment variables" });
        }

        // Find user and include password field
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: "User not found. Please register first." });
        }

        // Compare passwords
        let isPasswordCorrect;
        try {
            isPasswordCorrect = await bcrypt.compare(password, user.password);
        } catch (error) {
            console.error("Error comparing passwords:", error);
            return res.status(500).json({ message: "An error occurred while verifying the password" });
        }

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials. Please check your email and password." });
        }

        // Generate JWT token with name included
        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name, role: user.role },
            process.env.JWT_TOKEN,
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
            message: "Login successful",
            token, // Include the token in the response
            user: userData,
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "An error occurred during login" });
    }
};

export const getAllUsers=async(req,res)=>{
    try{
        const users = await User.find();
        res.json(users);
    }
catch(err){
    res.status(500).json({message: err.messge});
}

};


// Logout User
export const logoutUser = (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.status(200).json({ message: "Logout successful!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};