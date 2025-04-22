import jwt from 'jsonwebtoken';
import Blog from '../models/Blog.js'; // Your Blog Mongoose model
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

export const createBlogPost = async (req, res) => {
  const { title, content } = req.body;
  const token = req.cookies.token;

  // Validate required fields
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required!" });
  }

  // Check for access token
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Verify token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const userId = decoded.userId;

    // Create new blog post
    const newBlogPost = new Blog({
      title,
      content,
      user: userId,
    });

    // Save blog post to DB
    await newBlogPost.save();

    // Populate the user field (e.g. name and email) before sending response
    await newBlogPost.populate('user', 'name email');

    // Respond with the new blog post
    res.status(201).json(newBlogPost);
  } catch (err) {
    console.error("Error creating blog post:", err);

    // Handle expired token specifically
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Unauthorized: Token has expired" });
    }

    // General server error
    res.status(500).json({ message: err.message });
  }
};


export const getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await Blog.find().populate("user", "-password");
    res.status(200).json(blogPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getBlogPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const blogPost = await Blog.findById(id).populate("user", "-password");
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found!" });
    }

    res.status(200).json(blogPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
