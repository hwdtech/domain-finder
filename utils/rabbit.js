const amqp = require('amqplib');

module.exports = {
  connectToRabbitMQ(address){
    return amqp.connect(address)
      .then(conn => conn.createChannel());
  }
};
