const kafkaProducer = require('./kafka_producer');
const uuid = require('uuid');
// const topic = "node.topic";
const topic = "dataanalysis.importtomongo";

kafkaProducer.connect().then(() => {
    setInterval(() => {
        // const key = new Date().toLocaleString();
        const key = uuid.v1();
        const msg = {
            key,
            num: Math.round(Math.random() * 100),
            float: Math.random(),
            boolen: true,
            Date: new Date(),
            str: "node kafka",
            u: undefined,
            n: null,
            o: {
                a: "a",
                b: "b"
            },
            a: [1, 2, 3]
        };

        kafkaProducer.send({
            topic: topic,
            messages: [{
                key: key,
                value: JSON.stringify(msg)
            }]
        }).then(metaData => {
            console.log(metaData);
        });
    }, 10);
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
            await kafkaProducer.disconnect();
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

// node client_console_producer.js