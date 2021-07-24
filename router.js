const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const kafka_producer = require('./kafka_producer');
const topic = "node.topic";

router.use('/publish', function(req, res) {
    const key = new Date().toLocaleString();
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

    kafka_producer.send({
        topic: topic,
        messages: [{
            key: key,
            value: JSON.stringify(msg)
        }]
    }).then(metaData => {
        res.json(metaData).send();
    });
});

module.exports = router;