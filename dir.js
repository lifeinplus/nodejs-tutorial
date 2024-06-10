const fs = require("fs");

if (!fs.existsSync("./new")) {
    fs.mkdir("./new", (error) => {
        if (error) throw error;
        console.log("created");
    });
}

if (fs.existsSync("./new")) {
    fs.rmdir("./new", (error) => {
        if (error) throw error;
        console.log("REMOVED");
    });
}
