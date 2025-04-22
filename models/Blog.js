import mongoose from "mongoose";

// Define the schema for the Blog model

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: false
    },
    content: {
        type: String,
        required: true,
        unique: false
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, {
    timestamps: true
})

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;