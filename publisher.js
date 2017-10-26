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
let seq = 0;

client.on('connect', function () {
    async.forever(
        (next) => {
            setTimeout(() => {
            	seq++;
            	const msg = `${seq} @ ${new Date()}`;
            	client.publish('JANDI/test', msg, { qos: 2 });
            	console.log(msg);
                next();
            }, INTERVAL);
        },
        (err) => {
            logger.error("loopMessage>", err);
        }
    );
});
