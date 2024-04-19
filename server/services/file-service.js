const FileInfo = require('../models/fileInfo-model');
const connectDB = require('../config/bd');

const processMqtt = async (message) => {
    try {
        //const creationDate = message.toString().split(',')[0];
        const creationDate = new Date();
        const duration = message.toString().split(',')[1];
        const size = message.toString().split(',')[2];
        const file = new FileInfo({
            creationDate: creationDate,
            duration: duration,
            size: size || '2 MB'
        });
        const savedFile = await file.save();
        console.log('File information saved to MongoDB:', savedFile);
    } catch (error) {
        console.error('Error processing MQTT message:', error);
    }
};

const testdb = async () => {
    try {
        const file = new FileInfo({
            creationDate: new Date(),
            duration: '5 minutes',
            size: '10 MB'
        });

        const savedFile = await file.save();
        console.log('File information saved to MongoDB:', savedFile);
    } catch (error) {
        console.error('Error saving file to MongoDB:', error);
    }
};

const retrieveFileInfo = async () => {
    try {
        const files = await FileInfo.find();
        return files;
    } catch (error) {
        console.error('Error retrieving file information:', error);
    }

}

const deleteFileInfo = async (id) => {
    try {
        await FileInfo.deleteOne({ _id: id });
    } catch (error) {
        console.error('Error deleting file information:', error);
    }
}

async function processFtpFile(filePath) {
    const ftpClient = new ftp.Client();
    ftpClient.ftp.verbose = true;

    try {
        await ftpClient.access({
            host: 'ftp.example.com',
            user: 'ftpuser',
            password: 'ftppassword'
        });

        await ftpClient.downloadTo(fs.createWriteStream(filePath), filePath);

        console.log(`File downloaded from FTP: ${filePath}`);

    } catch (error) {
        console.error('FTP download error:', error);
    } finally {
        await ftpClient.close();
    }
}




module.exports = { 
    processMqtt,
    testdb,
    retrieveFileInfo,
    deleteFileInfo,
    processFtpFile

};
