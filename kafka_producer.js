const kafka = require('./kafka_instance');

const kafka_producer = kafka.producer();

module.exports = kafka_producer;