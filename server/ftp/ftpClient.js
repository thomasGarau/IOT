const FtpSrv = require('ftp-srv');
const hostname = '192.168.35.92';
const port = 21;
//serveur ftp pour récupérer les enreigstrements audio de l'esp32
const ftpServer = new FtpSrv({
    url: `ftp://${hostname}:${port}`,
    pasv_url: '192.168.35.92',  // Utilisez l'adresse IP externe si accédé de l'extérieur
    pasv_min: 1024,  // Définir le port minimal pour la plage passif
    pasv_max: 2048,  // Définir le port maximal pour la plage passif
    anonymous: true,  // Permettre les connexions anonymes
});

ftpServer.on('login', ({connection, username, password}, resolve, reject) => {
    console.log("utilisateur viens de ce co");
    if (username === 'anonymous') {
        resolve({root: './enregistrement'});
    } else {
        reject(new Error('Invalid username or password'));
    }
});

ftpServer.on('client-error', ({connection, context, error}) => {
    console.error(`Client error: ${error.message}`);
});

ftpServer.listen()
    .then(() => {
        console.log(`FTP Server running on ftp://${hostname}:${port}`);
    });
