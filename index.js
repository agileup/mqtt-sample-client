'use strict';

const fs = require('fs');
const mqtt = require('mqtt');

// var KEY = fs.readFileSync('client.key');
// var CERT = fs.readFileSync('client.crt');
// const CAfile = [fs.readFileSync('client.crt')];
const options = {
    host: 'dev.mqtt.jandi.io',
    port: 8883,
    keepalive: 0,
    // clientId: 'MQTTjs-12345',
    protocol: 'mqtts',
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    // ca: CAfile,
    // key: KEY,
    // cert: CERT,
    secureProtocol: 'TLSv1_method',
    rejectUnauthorized: false,
    // username: 'username',
    // password: 'password'
};
const client = mqtt.connect(options);

client.on('connect', function () {
    console.log("\tconnected!");
    client.subscribe('JANDI/#', { qos: 2 }, function(err, granted) {
        if (err) {
            console.error(err);
        } else {
            console.log("subscribed>", granted);
        }
    });
});

client.on('reconnect', function() {
    console.log("\treconnect");
});

client.on('close', function() {
    console.log("\tclose");
});

client.on('offline', function() {
    console.log("\toffline");
});

client.on('error', function(err) {
    console.log("\terror", err);
});

client.on('message', function (topic, message) {
    switch(topic) {
        case 'JANDI/test':
            console.log(topic, ">>>>", message.toString());
            break;
        default:
            console.log(topic, "----", message.toString());
            break;
    }
    // client.end();
});

/**
 * Want to notify controller that disconnected before shutting down
 */
function handleAppExit(options, err) {
    if (err) {
        console.log(err.stack)
    }

    if (options.cleanup) {
        client.publish('JANDI/connected', 'false');
    }

    if (options.exit) {
        process.exit()
    }
}

/**
 * Handle the different ways an application can shutdown
 */
process.on('exit', handleAppExit.bind(null, { cleanup: true }))
process.on('SIGINT', handleAppExit.bind(null, { exit: true }))
process.on('uncaughtException', handleAppExit.bind(null, { exit: true }))
