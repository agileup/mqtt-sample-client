'use strict';

const _ = require('lodash');
const async = require('async');
const path = require('path');

const mqtt = require('mqtt');
const options = {
    host: 'dev.mqtt.jandi.io',
    port: 8883,
    keepalive: 0,
    protocol: 'mqtts',
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    secureProtocol: 'TLSv1_method',
    rejectUnauthorized: false,
};
const client = mqtt.connect(options);

const INTERVAL = 10;
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
