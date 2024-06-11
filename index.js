const logEvents = require("./logEvents");
const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

myEmitter.on("log", (message) => logEvents(message));

setTimeout(() => {
    myEmitter.emit("log", "Log event emitted!");
}, 2000);
