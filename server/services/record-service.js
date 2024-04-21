const mqttClient = require('../mqtt/mqttClient');

//envois un message start à l'esp32 pour qu'il commence à enregistrer 
const startRecord = async () => {
    mqttClient.client.publish('test/topic', 'INTERNAL: start', {}, (error) => {
      if (error) {
        console.error('Failed to send start message:', error);
        return false;
      }
      console.log('Start message sent to ESP32');
    });
    return true;
}

//envois un message de stop à l'esp32 pour mettre fin à l'enregistrement
const stopRecord = async () => {
    mqttClient.client.publish('test/topic', 'INTERNAL: stop', {}, (error) => {
      if (error) {
        console.error('Failed to send stop message:', error);
        return false;
      }
      console.log('Stop message sent to ESP32');
    });
    return true;
}


const saveRecord = async(fileName) => {
    return true;
}

const cancelRecord = async () => {
    return true;
}


module.exports = {
    stopRecord,
    startRecord,
    cancelRecord,
    saveRecord
}