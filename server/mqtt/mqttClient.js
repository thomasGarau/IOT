const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://192.168.35.92');
const { processMqtt } = require('../services/file-service.js');

//stock la liste des utilisateur inscript a un topic
let subscriptions = new Map();
const topic = 'test/topic';

function subscribeToTopic(topic) {
    client.subscribe(topic, (err) => {
        if (!err) {
            console.log(`Subscribed to "${topic}"`);
            subscriptions.set(topic, true);
        } else {
            console.error('Subscription error:', err);
        }
    });
}


client.on('message', (topic, message) => {
    if (subscriptions.has(topic)) {
        const messageContent = message.toString();
        console.log(`Message received on "${topic}": "${messageContent}"`);
        
        //pour eviter de traiter les messages créer par notre serveur node
        if (!messageContent.startsWith("INTERNAL:")) {
            processMqtt(topic, messageContent);
        }
    }
});


client.on('connect', () => {
  console.log('Connected to MQTT broker');
  subscribeToTopic('test/topic');
});

client.on('error', (error) => {
  console.error('MQTT Client Error:', error);
});

module.exports = {
    client,
    subscribeToTopic,
    unsubscribeFromTopic: (topic) => {
        if (subscriptions.has(topic)) {
            client.unsubscribe(topic);
            subscriptions.delete(topic);
            console.log(`Unsubscribed from "${topic}"`);
        }
    }
};
