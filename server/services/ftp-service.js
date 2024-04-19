const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const FileInfo = require('../models/fileInfo-model');
const { getAudioDurationInSeconds } = require('get-audio-duration');

async function processFtpFile(fileName) {
    const filePath = path.join(__dirname, 'enregistrement', fileName);
    try {
        const stats = fs.statSync(filePath);
        const fileSize = stats.size; // Taille du fichier en octets

        const duration = await getAudioDurationInSeconds(filePath); // Durée en secondes
        const durationFormatted = `${Math.floor(duration / 60)}m${Math.floor(duration % 60)}s`; // Format mm:ss

        // Connexion à la base de données si pas déjà connectée
        if (mongoose.connection.readyState !== 1) {
            await connectDB();
        }

        const fileInfo = new FileInfo({
            creationDate: new Date(),
            duration: durationFormatted,
            size: `${(fileSize / 1024 / 1024).toFixed(2)} MB`
        });

        await fileInfo.save();
        console.log('File information saved to database:', fileInfo);
    } catch (error) {
        console.error('Error processing file:', error.message);
    }
}

module.exports = {
    processFtpFile
};