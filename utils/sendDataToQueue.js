const {rabbitUrl} = require('../appConfig');
const open = require('amqplib').connect(rabbitUrl);
const P = require('bluebird');

async function pushTasks(dataSet, channel, queueName) {
    let counter = 0;
    for (const data of dataSet) {
        console.log(counter++);
        await P.delay(10)
            .then(() => channel.sendToQueue(queueName, new Buffer(JSON.stringify(data)), {persistent: true}));
    }
};

module.exports = async (queueName, data) => {
    return open
        .then(conn => conn.createChannel())
        .then(channel => {
            channel.assertQueue(queueName, {durable: true});
            return pushTasks(data, channel, queueName);
        });
};
