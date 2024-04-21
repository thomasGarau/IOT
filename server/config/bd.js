const mongoose = require('mongoose');

//changer uri pour ce connecter à une colection mongoDB
const connectDB = async () => {
    const uri = "";

    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
    }
}

module.exports = connectDB;
