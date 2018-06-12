import React, { Component } from "react";
import ReactDOM from "react-dom";
import { HotKeys } from "react-hotkeys";
import socketIOClient from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import logo from "./assets/Cresta Logo.svg";
import "./styles/App.css";
import face from "./assets/avatarPlaceholder.png";
import ChatBox from "./components/ChatBox/ChatBox.jsx";
import ChatBar from "./components/ChatBar/ChatBar.jsx";
import ChatQueue from "./components/ChatQueue/ChatQueue.jsx";
import ChatWindows from "./components/ChatWindows/ChatWindows.jsx";
// TODO: Add comments everywhere
const socket = socketIOClient("http://127.0.0.1:3001");
export default class App extends Component {
    state = {
        userId: -1,
        username: "",
        currentUser: 0,
        currentText: "",
        conversations: {
            0: {
                id: 0,
                name: "Tutorial Todd",
                lastRecieved: Date.now(),
                lastSent: Date.now(),
                conversation: [
                    // TODO: Add more messages to fully explain the app
                    { sent: 0, text: "Hello Agent!" },
                    { sent: 0, text: "This is a tutorial chat." },
                    { sent: 0, text: "When other people **open this website**, they will pop up, and you can chat with them." }
                ]
            }
        },
        toastOptions: { position: "bottom-right", autoClose: 4500, hideProgressBar: true, closeOnClick: true, pauseOnHover: true }
    };
    componentDidMount() {
        this.setupScrollers();
        var keyMap = { send: "enter", nextWindow: "ctrl+alt+right", prevWindow: "ctrl+alt+left", focus: "ctrl+alt+f" };
        var handlers = {
            focus: () => this.setFocusToTextBox(),
            send: () => (this.state.currentText === "" ? this.setFocusToTextBox() : this.handleNewMessageSend(this.state.currentText)),
            nextWindow: () => this.hardSwitch(this.state.currentUser === this.state.conversations.length - 1 ? 0 : this.state.currentUser + 1),
            prevWindow: () => this.hardSwitch(this.state.currentUser === 0 ? this.state.conversations.length - 1 : this.state.currentUser - 1)
        };
        for (var i = 0; i < 10; i++) keyMap["switch" + i] = "alt+" + i;
        for (i = 0; i < 10; i++) handlers["switch" + i] = event => this.hardSwitch(event.key - 1);
        this.setState({ keyMap: keyMap, handlers: handlers });
        socket.on("self joined", data => {
            console.log("Joined room with data: ", data);
            this.setState({ userId: data.userid }, () => {
                for (var user in data.users) this.handleNewUser(user, data.users[user]);
            });
        });
        socket.on("user joined", data => {
            console.log("New user joined room with data: ", data);
            this.handleNewUser(data.userid, data.username);
        });
        socket.on("user left", data => {
            console.log("User left room with data ", data);
            this.handleLeftUser(data.userid, data.username);
        });
        socket.on("new message", data => {
            console.log("New Message broadcasted:", data);
            if (toInt(data.to) === toInt(this.state.userId)) this.handleNewMessageRecieved(toInt(data.from), data.text);
        });
        socket.on("typing", data => {
            var tempState = this.state;
            if (toInt(data.to) === toInt(this.state.userId)) tempState.conversations[toInt(data.from)].typing = data.text;
            this.setState(tempState);
            this.scrollToBottom(toInt(data.from), false, true);
        });
        socket.on("disconnect", data => {
            alert("You have been disconnected! Refreshing...");
            reload();
        });
    }
    handleUsernameInput = e => e.key === "Enter" && this.setUsername();
    handleNewUser(newId, name) {
        var tempState = this.state;
        if (tempState.userId !== newId && typeof name === "string")
            tempState.conversations[newId] = { id: newId, name: name, lastRecieved: Date.now(), lastSent: Date.now(), conversation: [], typing: "" };
        this.setState(tempState);
    }
    handleLeftUser(id, name) {
        var tempState = this.state;
        if (tempState.conversations[id] && tempState.conversations[id].name === name) delete tempState.conversations[id];
        if (tempState.currentUser === id) tempState.currentUser = 0;
        this.setState(tempState);
    }
    handleChatInput(reciever, msg) {
        socket.emit("typing", { from: toInt(this.state.userId), to: toInt(reciever), text: msg });
        this.setState({ currentText: msg });
    }
    handleNewMessageRecieved(sender, message) {
        sender = toInt(sender);
        var tempState = this.state;
        tempState.conversations[sender].conversation.push({ sent: sender, text: message });
        tempState.conversations[toInt(tempState.currentUser)].lastRecieved = Date.now();
        this.setState(tempState, () => {
            this.scrollToBottom(sender, true);
            this.loadToast(sender, tempState.conversations[sender].name, message, message);
        });
    }
    handleNewMessageSend(message) {
        if (!message) return;
        var tempState = this.state;
        tempState.conversations[toInt(tempState.currentUser)].conversation.push({ sent: -1, text: message });
        tempState.conversations[toInt(tempState.currentUser)].lastSent = Date.now();
        tempState.currentText = "";
        socket.emit("new message", { from: toInt(tempState.userId), to: toInt(tempState.currentUser), text: message });
        socket.emit("typing", { from: toInt(tempState.userId), to: toInt(tempState.currentUser), text: "" });
        this.setState(tempState, () => {
            this.scrollToBottom(toInt(tempState.currentUser), false);
            var userToSwitchTo = this.generateQueue().shift();
            this.loadToast(userToSwitchTo.userId, userToSwitchTo.name, message, userToSwitchTo.lastMessage);
        });
    }
    generateQueue() {
        // TODO: Write out mood and priority based on something....?
        const getMood = (sentTime, recievedTime) => "happy";
        const getPriority = (mood, sentTime, recievedTime) => "urgent";
        const getQueueItem = (id, name, msg, sentTime, recievedTime) => ({
            userId: id,
            name: name,
            lastMessage: msg,
            lastSentTime: sentTime,
            lastRecievedTime: recievedTime,
            lastSent: getSecondsSince(sentTime),
            lastRecieved: getSecondsSince(recievedTime),
            mood: getMood(getSecondsSince(sentTime), getSecondsSince(recievedTime)),
            priority: getPriority(
                getMood(getSecondsSince(sentTime), getSecondsSince(recievedTime)),
                getSecondsSince(sentTime),
                getSecondsSince(recievedTime)
            )
        });
        return Object.values(this.state.conversations)
            .map(chat =>
                getQueueItem(
                    chat.id,
                    chat.name,
                    chat.conversation.filter(message => message.sent !== -1).length === 0
                        ? ""
                        : chat.conversation.filter(message => message.sent !== -1).pop().text,
                    chat.lastSent,
                    chat.lastRecieved
                )
            ) // TODO: Fix sorting to bubble up people who text back more often
            .sort((a, b) => b.lastSent + b.lastRecieved - (a.lastSent + a.lastRecieved));
    }
    generateSmreplies() {
        return this.generateQueue().map(chat => {
            return { user: chat.userId, text: "What is " + chat.lastMessage + "?" };
        });
    }
    render() {
        this.scrollToCurrent();
        if (this.state.username) this.setFocusToTextBox();
        return (
            <HotKeys keyMap={this.state.keyMap} handlers={this.state.handlers} id="app">
                {ReactDOM.createPortal(
                    " | #" + toIntPlus(this.state.userId) + (this.state.username ? " - " + this.state.username : ""),
                    document.getElementById("title")
                )}
                {this.state.username === "" &&
                    ReactDOM.createPortal(
                        <div id="modal">
                            <div>
                                <div className="material padCont">
                                    <input
                                        name="userNameInput"
                                        id="userNameInput"
                                        autoFocus
                                        autoComplete="off"
                                        type="text"
                                        placeholder="Enter your username here..."
                                        onKeyUp={e => this.handleUsernameInput(e)}
                                    />
                                </div>
                                <div className="material box padCont" onClick={() => this.setUsername()}>
                                    Login
                                </div>
                            </div>
                        </div>,
                        document.getElementById("root")
                    )}
                <ChatWindows state={this.state} face={face} windowClick={i => this.hardSwitch(i)} />
                <ChatBox
                    state={this.state}
                    face={face}
                    replies={this.generateSmreplies()}
                    switchTo={i => this.hardSwitch(i)}
                    smrplyClick={i => this.loadSmartReply(i)}
                />
                <ChatBar state={this.state} onType={e => this.loadChatTyping(e)} />
                <ChatQueue state={this.state} face={face} queue={this.generateQueue()} windowClick={i => this.hardSwitch(i)} />
                <ToastContainer position="bottom-right" newestOnTop closeOnClick rtl={false} pauseOnVisibilityChange draggable pauseOnHover />
            </HotKeys>
        );
    }
    loadChatTyping = e => {
        this.handleChatInput(this.state.currentUser, e.target.value);
        this.scrollToBottom(toInt(this.state.currentUser), false, true);
    };
    loadSmartReply = smrply => {
        this.handleChatInput(smrply.user, this.state.currentText + " " + smrply.text);
        this.hardSwitch(smrply.user);
    };
    loadToast(switchToId, switchToName, switchMessage, lastSwitchMessage) {
        if (switchMessage.includes("switch") && lastSwitchMessage && this.state.currentUser !== switchToId)
            toast.info(
                <div className={"switchToast user" + switchToId} onClick={() => this.hardSwitch(switchToId)}>
                    {switchToName + " - #" + toIntPlus(switchToId) + ": " + lastSwitchMessage}
                </div>,
                this.state.toastOptions
            );
    }
    windowExists = i => {
        return document.querySelector("#chatread .user" + i);
    };
    setFocusToTextBox = () => {
        if (document.getElementById("chatboxinput")) document.getElementById("chatboxinput").focus();
    };
    hardSwitch = i => {
        this.switchWindow(i);
        this.scrollToBottom(i);
        this.setFocusToTextBox();
    };
    switchWindow = i => {
        console.log("what?");
        if (!this.windowExists(i)) return;
        console.log("what wheahwhawhawhawhhaw?");
        console.log(i);
        this.setState({ currentUser: i });
    };
    setFocusToTextBox = () => {
        if (document.getElementById("chatboxinput")) document.getElementById("chatboxinput").focus();
    };
    scrollToBottom(i, checkEmptyText, checkScrolledUp) {
        var chatWindow = document.querySelector("#chatread .user" + i);
        if (
            i > -1 &&
            chatWindow &&
            (!checkEmptyText || !this.state.currentText) &&
            (!checkScrolledUp || !(chatWindow.scrollHeight - chatWindow.clientHeight - Math.round(chatWindow.scrollTop) > 100))
        )
            chatWindow.scrollTop = chatWindow.scrollHeight;
    }
    scrollToCurrent = () => {
        var _this = this;
        setTimeout(
            () =>
                window.requestAnimationFrame(() => {
                    if (_this.centerView() === false) console.log("Could not center!");
                }),
            0
        );
    };
    centerView = () => {
        var i = this.state.currentUser;
        if (this.windowExists(i))
            return (document.querySelector("#chatread ul").scrollLeft =
                document.querySelector("#chatread .user" + i).offsetLeft -
                (document.querySelector("#chatread").clientWidth - document.querySelector("#chatread .user" + i).clientWidth) / 2);
        return false;
    };
    setUsername = () => {
        var temp = document.getElementById("userNameInput");
        if (!temp.value || temp.value.length > 13) {
            alert("Invalid username");
            temp.focus();
        } else {
            socket.emit("add user", temp.value);
            this.setState({ username: temp.value });
        }
    };
    setupScrollers = () => {
        init(document.querySelector("#chatread ul"));
        init(document.querySelector("#chatsend"));
    };
}

const getSecondsSince = time => Math.floor((Date.now() - time) / 1000);
const reload = () => window.location.reload();
const toIntPlus = i => toInt(i, 10) + 1;
const toInt = i => parseInt(i, 10);

function init(el) {
    console.log("element to scroll on:", el, "avoid elements:", document.querySelectorAll("#chatread ul li"));
    if (!el) return;
    if (el.addEventListener) {
        el.addEventListener("mousewheel", e => scrollHorizontally(e, el), false);
        el.addEventListener("DOMMouseScroll", e => scrollHorizontally(e, el), false);
    } else el.attachEvent("onmousewheel", e => scrollHorizontally(e, el));
}

function scrollHorizontally(e, el) {
    e = window.event || e;
    e.preventDefault();
    el.scrollLeft -= e.wheelDelta || -e.detail;
}
