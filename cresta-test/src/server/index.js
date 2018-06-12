const path = require("path");
const socket = require("socket.io");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = socket(server);
const port = process.env.PORT || 3001;
app.use(express.static(path.join(__dirname, "../../build")));
// Chatroom
var usersArray = [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
server.listen(port, () => console.log("Served w/ socket.io on localhost:" + port + "; max capacity of " + usersArray.length + " users."));
io.on("connection", socket => {
    socket.userid = getFirstEmptyIndex();
    usersArray[socket.userid] = true;
    console.log("New user " + socket.userid + " connected to socket server.");
    socket.emit("self joined", { userid: socket.userid, users: usersArray });
    socket.on("add user", data => {
        if (isEmpty(usersArray[socket.userid])) return;
        usersArray[socket.userid] = data;
        console.log("User " + socket.userid + " joined room with username:", usersArray[socket.userid]);
        socket.broadcast.emit("user joined", { userid: socket.userid, username: usersArray[socket.userid] });
    });
    socket.on("new message", data => socket.broadcast.emit("new message", data));
    socket.on("typing", data => socket.broadcast.emit("typing", data));
    socket.on("disconnect", () => {
        console.log("User " + usersArray[socket.userid] + " id " + socket.userid + " disconnected from the socket server.");
        if (!isEmpty(usersArray[socket.userid])) {
            socket.broadcast.emit("user left", { userid: socket.userid, username: usersArray[socket.userid] });
            usersArray[socket.userid] = false;
        }
    });
});
const isEmpty = val => val === false;
const getFirstEmptyIndex = () => usersArray.findIndex(isEmpty);
