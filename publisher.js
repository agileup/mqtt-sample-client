'use strict';

const _ = require('lodash');
const async = require('async');
const path = require('path');

const mqtt = require('mqtt');
const options = {
    host: 'mqtt.jandi.io',
    port: 8883,
    keepalive: 0,
};
const client = mqtt.connect(options);

const INTERVAL = 5000;

client.on('connect', function () {
    client.subscribe('#', { qos: 2 }, function(err, granted) {
        if (err) {
            console.error(err);
        } else {
            console.log("subscribed>", granted);
        }
    });
});

client.on('message', function (topic, message) {
    console.log(topic, ">>>", message.toString());
});

const loopMessage = () => {
	let seq = 0;
    async.forever(
        (next) => {
            setTimeout(() => {
            	seq++;
            	client.publish('JANDI/test', `${seq} @ ${new Date()}`, { qos: 2 });
                next();
            }, INTERVAL);
        },
        (err) => {
            logger.error("loopMessage>", err);
        }
    );
};
loopMessage();
