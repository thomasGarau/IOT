const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fileRoutes = require('./routes/file-route');
const mqttClient = require('./mqtt/mqttClient');
const connectDB = require('./config/bd');
const cors = require('cors')
require('./ftp/ftpClient');

//require les fichier ftp et mqtt client afin que le serveur ecoute ces protocoles


app.use(bodyParser.json());
//eviter les erreur de cross origin
app.use(cors());

app.use('/file', fileRoutes);

//creer une conenction à la db mongo  atlas
//changer les identifiant pour que cela soit fonctionnel
connectDB();

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
  });
});

process.on('SIGTERM', () => {
  server.close(() => {
      console.log('Server closed due to app termination');
      mongoose.connection.close(() => {
          console.log('MongoDB connection closed due to app termination');
          process.exit(0);
      });
  });
});