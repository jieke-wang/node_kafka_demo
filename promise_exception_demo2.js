let domain = require('domain');

// 每秒钟打印一次时间，确保程序没有奔溃
(function loop() {
    console.log(new Date().getTime());
    setTimeout(() => {
        loop();
    }, 1000);
})();

let asyncFunc = (resolve, reject, ...params) => {
    setTimeout(() => {
        console.log(resolve);
        console.log(reject);
        console.log(params);
        throw new Error("async error");
        // resolve();
        // reject();
    }, 1000);
};

let asyncPromise = (...params) => {
    return new Promise((resolve, reject) => {
        asyncFunc(resolve, reject, ...params);
    });
};

function run() {
    return new Promise((resolve, reject) => {
        let params = ['a', 1, false, new Date()];
        let d = domain.create();
        d.on('error', function(e) {
            console.log('处理异常');
            /*处理异常*/
            console.log(e);
            console.log(params);
            reject(e);
        });
        d.run(asyncPromise, ...params).then(() => {
            resolve("执行成功");
        }).catch(() => {
            reject("执行失败");
        });
    });
}

setInterval(() => {
    run().then((...args) => {
        console.log('then', args);
    }).catch((...args) => {
        console.log('catch', args);
    });
}, 100);

async function cleanUpServer(eventType) {
    console.log(eventType);
    switch (eventType) {
        case "exit":
        case "SIGINT":
        case "SIGUSR1":
        case "SIGUSR2":
        case "SIGTERM":
            console.log('退出应用')
            process.exit(0);
            break;
        default:
            break;
    }
}

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, (...args) => {
        if (args && args.length) {
            console.log(args);
        }

        setTimeout(async() => {
            await cleanUpServer(eventType);
        }, 10);
    });
});

// node promise_exception_demo2.js
// https://nodejs.org/api/domain.html