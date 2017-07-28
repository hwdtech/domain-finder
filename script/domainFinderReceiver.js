const log = require('../utils/createLogger')('domainFinderReceiver');
const amqp = require('amqplib');
const {requestPortionDomainsInfo} = require('../services/godaddy/fetchService');
const {workWithChunkedDomainsInfo} = require('../services/godaddy/dataPreparationService');
const P = require('bluebird');
const {queueName, rabbitUrl} = require('../appConfig');
let counter = 0;

log.info('Start: domainFinderReceiver');
amqp.connect(rabbitUrl)
    .then(conn => conn.createChannel())
    .then(ch => {
        ch.assertQueue(queueName, {durable: true});
        ch.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);
        ch.consume(queueName, function (msg) {
            log.info(`Consumed new data: ${counter++}`);
            const data = JSON.parse(msg.content.toString());
            requestPortionDomainsInfo(data)
                .then(chunkedDomainsInfo => workWithChunkedDomainsInfo(chunkedDomainsInfo))
                .then(() => P.delay(20000))
                .then(() => {
                    log.info(`portion ${counter - 1} done`);
                    ch.ack(msg);
                })
                .catch(err => console.log(err));
        });
    }, {noAck: false});
