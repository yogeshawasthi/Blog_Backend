import express from "express";
import { register,loginuser, getAllUsers, logoutUser} from "../controllers/userController.js";

const router = express.Router();

//Route for signing up a new user
router.post('/signup', register);

//Route for logging in a user
router.post('/login',loginuser);

//mongodb://localhost:27017/
router.get('/getall',getAllUsers)

router.get('/logout',logoutUser)



export default router;
