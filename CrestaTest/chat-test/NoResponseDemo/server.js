const path = require("path");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const port = process.env.PORT || 3001;
app.use(express.static(path.join(__dirname, "./client")));
app.get("/delay", (req, res) => timeout(req, res));
app.get("/respond", (req, res) => res.send({ Data: "It Works!" }));
app.get("/respond2", (req, res) => res.send({ Data: "It Works 2!" }));
app.get("/respond3", (req, res) => res.send({ Data: "It Works 3!" }));
server.listen(port);
function timeout() {
    // Times out forever.
    setTimeout(timeout, 2000);
}
// Very simple server that responds with data or simulates no response ever.
