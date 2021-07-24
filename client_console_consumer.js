const kafkaConsumer = require('./kafka_consumer');

kafkaConsumer.connect().then(() => {
    return kafkaConsumer.subscribe({
        // topic: "node.topic"
        topic: "pps.rc"
    });
}).then(() => {
    kafkaConsumer.run({
        eachMessage: async({
            topic,
            partion,
            message
        }) => {
            console.log({
                topic,
                partion,
                key: message.key && message.key.toLocaleString(),
                value: message.value && message.value.toLocaleString()
            });
        }
    });
});

async function cleanUpServer(eventType) {
    console.log(eventType);
    switch (eventType) {
        case "exit":
        case "SIGINT":
        case "SIGUSR1":
        case "SIGUSR2":
        case "SIGTERM":
            console.log("断开kafka连接");
            await kafkaConsumer.disconnect();
            console.log('断开连接完成')
            console.log('退出应用')
            process.exit(0);
            break;
        default:
            break;
    }
}

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, (error) => {
        if (error) {
            console.log(error);
        }

        setTimeout(async() => {
            await cleanUpServer(eventType);
        }, 10);
    });
});

// node client_console_consumer.js