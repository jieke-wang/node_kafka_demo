const express = require('express');
const cors = require('cors');
const router = require('./router');
const initialize = require('express-init');
const kafkaProducer = require('./kafka_producer');
const kafkaConsumer = require('./kafka_consumer');

const app = express();
const port = 3000;

app.use('/', cors(), router);

initialize(app, (error) => {
    if (error)
        throw new Error(error);
    console.log("初始化");

    kafkaProducer.connect().catch((error) => {
        if (error) console.log(error);
        return kafkaProducer.connect();
    });

    kafkaConsumer.connect().then(() => {
        return kafkaConsumer.subscribe({
            topic: "node.topic"
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

    const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));
    async function cleanUpServer(eventType) {
        console.log(eventType);
        switch (eventType) {
            case "exit":
            case "SIGINT":
            case "SIGUSR1":
            case "SIGUSR2":
            case "SIGTERM":
                console.log('开始关闭');
                await new Promise((resolve) => {
                    server.close(error => {
                        if (error) {
                            console.log(error);
                        }
                        resolve(error);
                    });
                });
                console.log('完成关闭');
                console.log("断开kafka连接");
                await kafkaProducer.disconnect();
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
});

// http://127.0.0.1:3000/publish