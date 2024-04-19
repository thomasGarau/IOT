
const mqttClient = require('../mqtt/mqttClient');
const fileService = require('../services/file-service');
const recordService = require('../services/record-service')

exports.getFileInfo = async (req, res) => {
    try{
        const files = await fileService.retrieveFileInfo();
        res.status(200).send(files)
    }catch (error) {
        res.send("error", error, 500)
        console.log(error);
    }

  };
  
  exports.addFile = (req, res) => {
    res.send('File added');
  };
  
  exports.delFile = async (req, res) => {
    try{
        const id = req.body.id;
        await fileService.deleteFileInfo(id);
        res.status(200).send("File deleted")
    }catch{
        res.send("error", error, 500)
        console.log(error);
    }
  };

  exports.getMqttMessages = (req, res) => {
    const messages = mqttClient.getMessages();
    console.log("eze")
    res.json(messages);
  };
  
  exports.clearMqttMessages = (req, res) => {
    mqttClient.clearMessages();
    res.send('Messages cleared');
  };
  

  exports.testbd = async (req, res) => {
    await fileService.testdb()
    res.send('Messages cleared');
  };

  exports.startRecord = async (req, res) => {
    try {
        console.log("start")
        await recordService.startRecord();
        res.send('Record start');
    } catch (error) {
        console.error('Error starting record:', error);
        res.status(500).send(error.toString());
    }
}

exports.stopRecord = async (req, res) => {
    try {
        console.log("stop")
        await recordService.stopRecord();
        res.send('Record stop');
    } catch (error) {
        console.error('Error stopping record:', error);
        res.status(500).send(error.toString());
    }
}

  exports.saveRecord = async (req, res) => {
    try{
        const fileName = req.body.name
        await recordService.saveRecord(fileName)
        res.send('record save')
    }catch (error){
        console.log(error)
        res.send(error)
    }
  }


  exports.cancelRecord = async (req, res) => {
    try{
        await recordService.cancelRecord()
        res.send('record cancel')
    }catch (error){
        console.log(error)
        res.send(error)
    }
  }

