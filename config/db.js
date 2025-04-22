import { connect } from "mongoose";

const connectDB = async () => {
    try {
        await connect(process.env.MONGO_URI, {
            // Configuration options can be added here
        });
        console.log('Mongo DB connected');
    } catch (error) {
        console.error('Mongo DB connection failed:', error);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;