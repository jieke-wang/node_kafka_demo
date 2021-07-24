const kafka = require('./kafka_instance');
const kafkaConsumer = kafka.consumer({
    groupId: "node.consumer.group"
});

module.exports = kafkaConsumer;