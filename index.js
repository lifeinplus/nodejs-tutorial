const fsPromises = require("fs").promises;
const path = require("path");

const fileOps = async () => {
    try {
        const data = await fsPromises.readFile(
            path.join(__dirname, "files", "starter.txt"),
            "utf8"
        );

        console.log(data);

        await fsPromises.unlink(path.join(__dirname, "files", "starter.txt"));

        await fsPromises.writeFile(
            path.join(__dirname, "files", "promiseWrite.txt"),
            data
        );

        await fsPromises.appendFile(
            path.join(__dirname, "files", "promiseWrite.txt"),
            "\n\nTesting text."
        );

        await fsPromises.rename(
            path.join(__dirname, "files", "promiseWrite.txt"),
            path.join(__dirname, "files", "promiseComplete.txt")
        );

        const newData = await fsPromises.readFile(
            path.join(__dirname, "files", "promiseComplete.txt"),
            "utf8"
        );

        console.log(newData);
    } catch (error) {
        console.error();
    }
};

fileOps();

//
//             (error) => {
//                 if (error) throw error;
//                 console.log("Append complete");

//
//                     (error) => {
//                         if (error) throw error;
//                         console.log("Rename complete");
//                     }
//                 );
//             }
//         );
//     }
// );

process.on("uncaughtException", (error) => {
    console.log("There was an uncaught error:", error);
    process.exit(1);
});
