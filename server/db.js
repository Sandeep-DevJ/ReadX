import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/pheonix`)
        console.log('MongoDB connected successfully');
    }catch (error) {
            console.log('Database connection error:', error);
        }
}

export default connectDB;