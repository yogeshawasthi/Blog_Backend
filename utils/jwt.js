import jwt from 'jsonwebtoken';

// Function to generate an access token
export const generateAccessToken = (userId, role, name, email) => {
    return jwt.sign({ userId, role, name, email }, process.env.JWT_TOKEN, { expiresIn: '1h' });
};

// Function to generate a refresh token
export const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_TOKEN, { expiresIn: '7d' });
};