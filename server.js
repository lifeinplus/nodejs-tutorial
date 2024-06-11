const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const EventEmitter = require("events");

const logEvents = require("./logEvents");

class Emitter extends EventEmitter {}

const emitter = new Emitter();
emitter.on("log", (message, fileName) => logEvents(message, fileName));

const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath,
            contentType.includes("image") ? "" : "utf8"
        );

        const data =
            contentType === "application/json" ? JSON.parse(rawData) : rawData;

        response.writeHead(filePath.includes("404.html") ? 400 : 200, {
            contentType,
        });

        response.end(
            contentType === "application/json" ? JSON.stringify(data) : data
        );
    } catch (error) {
        console.error(error);
        emitter.emit("log", `${error.name}\t${error.message}`, "errLog.txt");
        response.statusCode = 500;
        response.end();
    }
};

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    emitter.emit("log", `${req.url}\t${req.method}`, "reqLog.txt");

    const extension = path.extname(req.url);

    let contentType;

    switch (extension) {
        case ".css":
            contentType = "text/css";
            break;
        case ".json":
            contentType = "application/json";
            break;
        case ".png":
            contentType = "image/png";
            break;
        case ".txt":
            contentType = "text/plain";
            break;

        default:
            contentType = "text/html";
            break;
    }

    let filePath =
        contentType === "text/html" && req.url === "/"
            ? path.join(__dirname, "views", "index.html")
            : contentType === "text/html" && req.url.slice(-1) === "/"
            ? path.join(__dirname, "views", req.url, "index.html")
            : contentType === "text/html"
            ? path.join(__dirname, "views", req.url)
            : path.join(__dirname, req.url);

    if (!extension && req.url.slice(-1) !== "/") {
        filePath += ".html";
    }

    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
        serveFile(filePath, contentType, res);
    } else {
        switch (path.parse(filePath).base) {
            case "old-page.html":
                res.writeHead(301, { location: "/new-page.html" });
                res.end();
                break;
            case "www-page.html":
                res.writeHead(301, { location: "/" });
                res.end();
                break;

            default:
                serveFile(
                    path.join(__dirname, "views", "404.html"),
                    "text/html",
                    res
                );
                break;
        }
    }
});

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
