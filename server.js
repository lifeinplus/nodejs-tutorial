const cors = require("cors");
const express = require("express");
const path = require("path");

const corsOptions = require("./config/corsOptions");
const errorHandler = require("./middleware/errorHandler");
const { logger } = require("./middleware/logEvents");

const app = express();
const PORT = process.env.PORT || 3500;

app.use(logger);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/employees", require("./routes/api/employees"));

app.get(
    "/hello(.html)?",
    (req, res, next) => {
        console.log("attempted to load hello.html");
        next();
    },
    (req, res) => {
        res.send("Hello World!");
    }
);

app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
        res.json({ error: "404 Not Found" });
    } else {
        res.type("text").send("404 Not Found");
    }
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
