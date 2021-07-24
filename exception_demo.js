let events = require("events");

//创建一个事件监听对象
let emitter = new events.EventEmitter();
//监听error事件
emitter.addListener("error", function(e) {
    /*处理异常*/
    console.log(e);
});

// 每秒钟打印一次时间，确保程序没有奔溃
(function loop() {
    console.log(new Date().getTime());
    setTimeout(() => {
        loop();
    }, 1000);
})();

// 模拟同步代码块内出现异常
let syncError = () => {
    throw new Error('Sync Error');
};

// 模拟异步代码块内出现异常
let asyncError = () => {
    setTimeout(function() {
        try {
            throw new Error('Async Error');
        } catch (error) {
            //触发error事件
            emitter.emit("error", error);
        }
    }, 100);
};

try {
    syncError();
} catch (error) {
    console.log(error);
}
console.log('异常被捕获了，我可以继续执行')

asyncError();

// 模拟异步代码块内出现异常
let asyncError2 = () => {
    setTimeout(function() {
        throw new Error('Async Error2');
    }, 100);
};

try {
    asyncError2();
} catch (error) {
    console.log(error);
}

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

// node exception_demo.js

// Nodejs异常处理
// https://segmentfault.com/a/1190000009651765