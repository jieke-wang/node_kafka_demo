const kafkaSetting = require("./kafka_setting");
const {
    Kafka
} =
require("kafkajs");

const kafka = new Kafka(kafkaSetting);
module.exports = kafka;