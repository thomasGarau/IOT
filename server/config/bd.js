const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = "mongodb+srv://thomasgarau8:yc69OYW1f4OBt17s@cluster0.tcen0pp.mongodb.net/iot";

    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
    }
}

module.exports = connectDB;
