const models = require('../models');
const log = require('../utils/createLogger')('domainFinderReceiver');
const {workWithRuDomains} = require('../services/domainInformation_DE/preparators');
const {request10RuDomains} = require('../services/domainInformation_DE/fetchers');
const {connectToRabbitMQ} = require('../utils/rabbit');
const {queueForRuZone, rabbitUrl} = require('../appConfig');
let counter = 0;

connectToRabbitMQ(rabbitUrl)
    .then(ch => {
        log.info('Start: domainFinderReceiver');
        ch.assertQueue(queueForRuZone, {durable: true});
        ch.prefetch(1);
        log.info(" [*] Waiting for messages in %s. To exit press CTRL+C", queueForRuZone);
        ch.consume(queueForRuZone, function (msg) {
            log.info(`Consumed new data: ${counter++}`);
            request10RuDomains(JSON.parse(msg.content.toString()))
                .then(chunkedDomainsInfo => workWithRuDomains(chunkedDomainsInfo))
                .then(() => {
                    log.info(`portion ${counter - 1} done`);
                    ch.ack(msg);
                })
                .catch(err => log.error(err));
        });
    }, {noAck: false});
