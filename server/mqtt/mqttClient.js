const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://192.168.35.92');
const { processMqtt } = require('../services/file-service.js');

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

// setInterval(() => {
//     const message = "INTERNAL: Hello, this is a regular update every 15 seconds.";
//     client.publish(topic, message, {}, (error) => {
//       if (error) {
//         console.error('Failed to publish message:', error);
//       } else {
//         console.log(`Message sent to "${topic}": ${message}`);
//       }
//     });
// }, 5000);


client.on('message', (topic, message) => {
    if (subscriptions.has(topic)) {
        const messageContent = message.toString();
        console.log(`Message received on "${topic}": "${messageContent}"`);
        
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
