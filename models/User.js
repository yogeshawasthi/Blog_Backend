import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: false
    },
    role:{
        type: String,
        enum: ["user","admin","superadmin"],
        default : "user",
    },
    refreshToken:{
        type:String,
    },

});


const User = mongoose.model("User", userSchema);
export default User;