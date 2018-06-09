import React, { Component } from "react";
import ReactDOM from "react-dom";
import { HotKeys } from "react-hotkeys";
// import logo from "./assets/Cresta Logo.svg";
import "./styles/App.css";
import face from "./assets/avatarPlaceholder.png";
import ChatBox from "./components/ChatBox/ChatBox.jsx";
import ChatBar from "./components/ChatBar/ChatBar.jsx";
import ChatQueue from "./components/ChatQueue/ChatQueue.jsx";
import ChatWindows from "./components/ChatWindows/ChatWindows.jsx";
export default class App extends Component {
    state = {
        currentUser: 0,
        currentText: "",
        conversations: [
            {
                id: 0,
                name: "Tutorial Todd",
                lastRecieved: Date.now(),
                lastSent: Date.now(),
                conversation: [
                    { sent: 0, text: "Hello Agent!" },
                    { sent: 0, text: "This is a tutorial chat." },
                    { sent: 0, text: "When other people **open this website**, they will pop up, and you can chat with them." }
                ]
            },
            {
                id: 1,
                name: "Mark",
                lastRecieved: Date.now(),
                lastSent: Date.now(),
                conversation: [{ sent: -1, text: "messageA" }, { sent: 0, text: "messageA" }],
                typing: "currently typing"
            },
            {
                id: 2,
                name: "Jennie",
                lastRecieved: Date.now(),
                lastSent: Date.now(),
                conversation: [{ sent: 1, text: "messageA" }, { sent: -1, text: "messageA" }],
                typing: ""
            },
            {
                id: 3,
                name: "JennieWHY",
                lastRecieved: Date.now(),
                lastSent: Date.now(),
                conversation: [{ sent: 1, text: "messageA" }, { sent: -1, text: "messageA" }],
                typing: ""
            },
            {
                id: 4,
                name: "Jennie",
                lastRecieved: Date.now(),
                lastSent: Date.now(),
                conversation: [{ sent: 1, text: "messageA" }, { sent: -1, text: "messageA" }],
                typing: ""
            },
            {
                id: 5,
                name: "Jennie",
                lastRecieved: Date.now(),
                lastSent: Date.now(),
                conversation: [{ sent: 1, text: "messageA" }, { sent: -1, text: "messageA" }],
                typing: "currently typing"
            },
            {
                id: 6,
                name: "Jennie",
                lastRecieved: Date.now(),
                lastSent: Date.now(),
                conversation: [{ sent: 1, text: "messageA" }, { sent: -1, text: "messageA" }],
                typing: ""
            },
            {
                id: 7,
                name: "Jennie",
                lastRecieved: Date.now(),
                lastSent: Date.now(),
                conversation: [{ sent: 1, text: "messageA" }, { sent: -1, text: "messageA" }],
                typing: ""
            },
            {
                id: 8,
                name: "Jennie",
                lastRecieved: Date.now(),
                lastSent: Date.now(),
                conversation: [{ sent: 1, text: "messageA" }, { sent: -1, text: "messageA" }],
                typing: ""
            },
            {
                id: 9,
                name: "Jennie",
                lastRecieved: Date.now(),
                lastSent: Date.now(),
                conversation: [{ sent: 1, text: "messageA" }, { sent: -1, text: "messageA" }],
                typing: ""
            },
            {
                id: 10,
                name: "Jennie",
                lastRecieved: Date.now(),
                lastSent: Date.now(),
                conversation: [{ sent: 1, text: "messageA" }, { sent: -1, text: "messageA" }],
                typing: ""
            },
            {
                id: 11,
                name: "Jennie",
                lastRecieved: Date.now(),
                lastSent: Date.now(),
                conversation: [{ sent: 1, text: "messageA" }, { sent: -1, text: "messageA" }],
                typing: "currently typing"
            },
            {
                id: 12,
                name: "Jennie",
                lastRecieved: Date.now(),
                lastSent: Date.now(),
                conversation: [{ sent: 1, text: "messageA" }, { sent: -1, text: "messageA" }],
                typing: ""
            },
            {
                id: 13,
                name: "Jennie",
                lastRecieved: Date.now(),
                lastSent: Date.now(),
                conversation: [{ sent: 1, text: "messageA" }, { sent: -1, text: "messageA" }],
                typing: ""
            },
            {
                id: 14,
                name: "Jennie",
                lastRecieved: Date.now(),
                lastSent: Date.now(),
                conversation: [{ sent: 1, text: "messageA" }, { sent: -1, text: "messageA" }],
                typing: "currently typing"
            }
        ]
    };
    componentDidMount() {
        this.setupScrollers();
    }
    loadSmartReply(smrply) {
        this.switchWindow(smrply.user);
        this.setState({ currentText: this.state.currentText + " " + smrply.text });
    }
    handleChatInput = e => {
        this.setState({ currentText: e.target.value });
        this.scrollToBottom(this.state.currentUser, false, true);
    };
    handleNewMessageRecieved(sender, message) {
        var tempState = this.state;
        tempState.conversations[sender].conversation.push({ sent: sender, text: message });
        tempState.conversations[this.state.currentUser].lastRecieved = Date.now();
        this.scrollToBottom(sender, true);
        this.setState(tempState);
    }
    handleNewMessageSend(message) {
        if (!message) return;
        var tempState = this.state;
        tempState.conversations[tempState.currentUser].conversation.push({ sent: -1, text: message });
        tempState.conversations[tempState.currentUser].lastSent = Date.now();
        tempState.currentText = "";
        this.scrollToBottom(tempState.currentUser, false);
        this.setState(tempState);
    }
    generateQueue() {
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
        return this.state.conversations
            .slice()
            .map(chat =>
                getQueueItem(
                    chat.id,
                    chat.name,
                    chat.conversation.filter(message => message.sent !== -1).pop().text,
                    chat.lastSent,
                    chat.lastRecieved
                )
            )
            .sort((a, b) => b.lastSent - b.lastRecieved - (a.lastSent - a.lastRecieved));
    }
    generateSmreplies() {
        return this.generateQueue().map(chat => {
            return { user: chat.userId, text: "What is " + chat.lastMessage + "?" };
        });
    }
    render() {
        // console.log("rendering");
        this.scrollToCurrent();
        this.setFocusToTextBox();
        var keyMap = { send: "enter", nextWindow: "ctrl+alt+right", prevWindow: "ctrl+alt+left", focus: "ctrl+alt+f" };
        var handlers = {
            focus: () => this.setFocusToTextBox(),
            send: () => this.handleNewMessageSend(this.state.currentText),
            nextWindow: () => this.switchWindow(this.state.currentUser === this.state.conversations.length - 1 ? 0 : this.state.currentUser + 1),
            prevWindow: () => this.switchWindow(this.state.currentUser === 0 ? this.state.conversations.length - 1 : this.state.currentUser - 1)
        };
        for (var i = 0; i < 10; i++) keyMap["switch" + i] = "alt+" + i;
        for (i = 0; i < 10; i++) handlers["switch" + i] = (event, window) => this.switchWindow(event.key - 1);
        return (
            <HotKeys keyMap={keyMap} handlers={handlers} id="app">
                {/* {ReactDOM.createPortal(
                    <div id="modal">
                        <div>
                            <h1>woah</h1>
                        </div>
                    </div>,
                    document.getElementById("root")
                )} */}
                <ChatWindows state={this.state} face={face} windowClick={i => this.switchWindow(i)} />
                <ChatBox
                    state={this.state}
                    face={face}
                    replies={this.generateSmreplies()}
                    switchTo={i => this.switchWindow(i)}
                    smrplyClick={i => this.loadSmartReply(i)}
                />
                <ChatBar state={this.state} onType={e => this.handleChatInput(e)} />
                <ChatQueue state={this.state} face={face} queue={this.generateQueue()} windowClick={i => this.switchWindow(i)} />
            </HotKeys>
        );
    }
    setFocusToTextBox() {
        if (document.getElementById("chatboxinput")) document.getElementById("chatboxinput").focus();
    }
    windowExists(i) {
        return document.querySelector("#chatread .user" + i);
    }
    switchWindow(i) {
        if (!this.windowExists(i)) return;
        this.setState({ currentUser: i });
    }
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
    scrollToCurrent() {
        var _this = this;
        setTimeout(
            () =>
                window.requestAnimationFrame(() => {
                    if (_this.centerView() === false) console.log("Could not center!");
                }),
            0
        );
    }
    centerView() {
        var i = this.state.currentUser;
        if (this.windowExists(i))
            return (document.querySelector("#chatread ul").scrollLeft =
                document.querySelector("#chatread .user" + i).offsetLeft -
                (document.querySelector("#chatread").clientWidth - document.querySelector("#chatread .user" + i).clientWidth) / 2);
        return false;
    }
    setupScrollers() {
        // init(document.querySelector("#chatread ul"));
        init(document.querySelector("#chatsend"));
    }
}
const getSecondsSince = time => Math.floor((Date.now() - time) / 1000);

function init(el) {
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
