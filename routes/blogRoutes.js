import express from "express";
import { createBlogPost, getAllBlogPosts} from "../controllers/blogController.js";
import { authorize, verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/create',createBlogPost);
// router.post('/createblog',createBlogpost);
router.get('/blogs',getAllBlogPosts);



export default router;


