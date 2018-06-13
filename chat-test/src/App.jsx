// REDUXIFY = "Move to Redux"
import React, { Component } from "react"; // Imports React
import ReactDOM from "react-dom"; // Imports React DOM for portals I used for modals & title injection
import { HotKeys } from "react-hotkeys"; // Imports the ability to bind hotkey events to element containers
import socketIOClient from "socket.io-client"; // Imports the ability to handle sockets as a client; REDUXIFY
import { ToastContainer, toast } from "react-toastify"; // Imports the ability to create "toasts" to switch
import "react-toastify/dist/ReactToastify.css";
// import logo from "./assets/Chat Logo.svg";
import "./styles/App.css";
import face from "./assets/avatarPlaceholder.png";
import ChatBox from "./components/ChatBox/ChatBox.jsx";
import ChatBar from "./components/ChatBar/ChatBar.jsx";
import ChatQueue from "./components/ChatQueue/ChatQueue.jsx";
import ChatWindows from "./components/ChatWindows/ChatWindows.jsx";
const socket = socketIOClient("http://127.0.0.1:3001"); // Connects client to socket server, consider how to dynamically get URL; REDUXIFY
export default class App extends Component {
    state = {
        // This is the initial state.
        userId: -1, // The userID is the id of the user from the socket server, REDUXIFY
        username: "", // The username is the name of the user in the socket server, REDUXIFY
        currentUser: 0, // The currentUser is the currently selected target the user agent is talking to, REDUXIFY
        currentText: "", // The currentText is the currently typed input of the user agent, REDUXIFY
        conversations: {
            // The conversations is an object of user details and conversation arrays, REDUXIFY
            0: {
                id: 0,
                name: "Tutorial Todd",
                lastRecieved: Date.now(),
                lastSent: Date.now(),
                conversation: [
                    { sent: 0, text: "Hello Agent!" },
                    { sent: 0, text: "This is a tutorial chat." },
                    { sent: 0, text: "Messages can have emojis  and be styled with markdown:" },
                    { sent: 0, text: "To italicize simply use * *single asterisks* *." },
                    { sent: 0, text: "To bold simply use ** **double asterisks** **." },
                    { sent: 0, text: "When other people **open this website**, they will pop up, and you can chat with them." },
                    { sent: 0, text: "Each person will have a # assigned to them, to navigate to them, simply press alt+#." },
                    { sent: 0, text: "With only 10 digits possible, any other switching you need to do can be done with crtl+alt+left or right." },
                    { sent: 0, text: "If anybody says the word switch, you will get a notification to switch to them." },
                    { sent: 0, text: "If you say switch, you will get a notification to switch to one high priority." },
                    { sent: 0, text: "On gettting messages, chat windows will auto-scroll down unless you have scrolled up yourself." },
                    { sent: 0, text: "Press enter anywhere/click on anything to focus on the chat bar to start typing." },
                    { sent: 0, text: "With text in the chat bar, pressing enter anywhere sends the message to the selected user." },
                    { sent: 0, text: "You can preview your message in the chat window, along with what the user is typing." },
                    { sent: 0, text: "On the right is a queue of users listed in order of priority, please try to reply to them first." },
                    { sent: 0, text: "Click on them to switch to them." },
                    { sent: 0, text: "Below is a list of auto generated smart replies based on user conversations." },
                    { sent: 0, text: "Click on them to switch to the appropriate user and have it typed into the chat bar for you." },
                    { sent: 0, text: "Please enjoy Chat Test." },
                    { sent: 0, text: "These are automated messages, do not reply." }
                ]
            }
        }, // The toastOptions is an object of options for the toast to use
        toastOptions: { position: "bottom-right", autoClose: 4500, hideProgressBar: true, closeOnClick: true, pauseOnHover: true }
    };
    componentDidMount() {
        this.setupScrollers(); // Allows for scrolling horizontally
        // Setups hotkeys using react hotkeys
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
        // Sets up socket events
        socket.on("self joined", data => {
            // Upon joining a room, add all existing users and setup self id.
            console.log("Joined room with data: ", data);
            this.setState({ userId: data.userid }, () => {
                for (var user in data.users) this.handleNewUser(user, data.users[user]);
            });
        });
        socket.on("user joined", data => {
            // When a user joins a room, add them to all existing users.
            console.log("New user joined room with data: ", data);
            this.handleNewUser(data.userid, data.username);
        });
        socket.on("user left", data => {
            // When a user leaves a room, remove them from all existing users.
            console.log("User left room with data ", data);
            this.handleLeftUser(data.userid, data.username);
        });
        socket.on("new message", data => {
            // When a new message comes from a user, if it's to this agent, add it to the appropriate messages window.
            console.log("New Message broadcasted:", data);
            if (toInt(data.to) === toInt(this.state.userId)) this.handleNewMessageRecieved(toInt(data.from), data.text);
        });
        socket.on("typing", data => {
            // When a message is typed by another user, if it's to this agent, add it as a temp in the correct message window.
            var tempState = this.state;
            if (toInt(data.to) === toInt(this.state.userId)) tempState.conversations[toInt(data.from)].typing = data.text;
            this.setState(tempState);
            this.scrollToBottom(toInt(data.from), false, true);
        });
        socket.on("disconnect", data => {
            // Upon disconnecting due to any reason, refresh the page.
            alert("You have been disconnected! Refreshing...");
            reload();
        });
    }
    handleUsernameInput = e => e.key === "Enter" && this.setUsername(); // Handles initial username setting.
    handleNewUser(newId, name) {
        // Handles adding new users as a chat window.
        var tempState = this.state;
        if (tempState.userId !== newId && typeof name === "string")
            tempState.conversations[newId] = { id: newId, name: name, lastRecieved: Date.now(), lastSent: Date.now(), conversation: [], typing: "" };
        this.setState(tempState);
    }
    handleLeftUser(id, name) {
        // Handles removing users from the chat windows.
        var tempState = this.state;
        if (tempState.conversations[id] && tempState.conversations[id].name === name) delete tempState.conversations[id];
        if (tempState.currentUser === id) tempState.currentUser = 0;
        this.setState(tempState);
    }
    handleChatInput(reciever, msg) {
        // Handles typing to the chat bar as a temp in the focused message window.
        socket.emit("typing", { from: toInt(this.state.userId), to: toInt(reciever), text: msg });
        this.setState({ currentText: msg });
    }
    handleNewMessageRecieved(sender, message) {
        // Handles all messaage events and puts them in the right window if sent to this agent.
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
        // Handles sending a message to a specific user upon pressing enter
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
        // Generates the queue of users sorted by priority and mood; TODO: Write out mood and priority based on something....?
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
            )
            .sort((a, b) => b.lastSent + b.lastRecieved - (a.lastSent + a.lastRecieved));
    }
    generateSmreplies() {
        // Generates a list of dumb "smart" replies based on the queue for it's order
        return this.generateQueue().map(chat => {
            return { user: chat.userId, text: "What is " + chat.lastMessage + "?" };
        });
    }
    render() {
        // Upon state change...
        this.scrollToCurrent(); // Scroll to currently selected user to talk to
        if (this.state.username) this.setFocusToTextBox(); // Set focus on chat bar once a room is joined
        return (
            // Setup Hotkeys
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
        // Load in the text from the chat bar using onType events
        this.handleChatInput(this.state.currentUser, e.target.value);
        this.scrollToBottom(toInt(this.state.currentUser), false, true);
    };
    loadSmartReply = smrply => {
        // Load in the text from a smart reply for a user to the chat bar; switches to that user
        this.handleChatInput(smrply.user, this.state.currentText + " " + smrply.text);
        this.hardSwitch(smrply.user);
    };
    loadToast(switchToId, switchToName, switchMessage, lastSwitchMessage) {
        // Pushes a toast notification (to switch to a specific user)
        if (switchMessage.includes("switch") && lastSwitchMessage && this.state.currentUser !== switchToId)
            toast.info(
                <div className={"switchToast user" + switchToId} onClick={() => this.hardSwitch(switchToId)}>
                    {switchToName + " - #" + toIntPlus(switchToId) + ": " + lastSwitchMessage}
                </div>,
                this.state.toastOptions
            );
    }
    windowExists = i => {
        // Check if a specific user has been loaded into the dom (possible to switch to them)
        return document.querySelector("#chatread .user" + i);
    };
    setFocusToTextBox = () => {
        // Sets the focus of the keyboard to the chat bar.
        if (document.getElementById("chatboxinput")) document.getElementById("chatboxinput").focus();
    };
    hardSwitch = i => {
        // Handles switching to a specific user completely
        this.switchWindow(i);
        this.scrollToBottom(i);
        this.setFocusToTextBox();
    };
    switchWindow = i => {
        // Switch the window state to a specific user.
        if (!this.windowExists(i)) return;
        this.setState({ currentUser: i }, () => console.log("NOW!!!!"));
    };
    scrollToBottom(i, checkEmptyText, checkScrolledUp) {
        // Scrolls to the bottom of a specific user chat window depending on some state checks
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
        // Scrolls and centers the chat window to a specific user using centerview
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
        // Contains the logic/math to actually center a specific chat window
        var i = this.state.currentUser;
        if (this.windowExists(i))
            return (document.querySelector("#chatread ul").scrollLeft =
                document.querySelector("#chatread .user" + i).offsetLeft -
                (document.querySelector("#chatread").clientWidth - document.querySelector("#chatread .user" + i).clientWidth) / 2);
        return false;
    };
    setUsername = () => {
        // Handles the actual act of logging into to a room by getting the username and emitting a socket.
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
        // Sets up horizontal scrolling for the smart replies (and maybe chat windows)
        init(document.querySelector("#chatread ul"), true);
        init(document.querySelector("#chatsend"));
    };
}

const getSecondsSince = time => Math.floor((Date.now() - time) / 1000); // A simple function to get the time in seconds since a timestamp
const reload = () => window.location.reload(); // Reloads the webpage
const toIntPlus = i => toInt(i, 10) + 1; // Returns a parsed int of i + 1
const toInt = i => parseInt(i, 10); // Returns a parsed int of i

function init(el, checks) {
    // Sets up horizontal scrolling for a certain element
    console.log("element to scroll on:", el, "avoid elements:", document.querySelectorAll("#chatread ul li"));
    if (!el) return;
    if (el.addEventListener) {
        el.addEventListener("mousewheel", e => scrollHorizontally(e, el, checks), false);
        el.addEventListener("DOMMouseScroll", e => scrollHorizontally(e, el, checks), false);
    } else el.attachEvent("onmousewheel", e => scrollHorizontally(e, el, checks));
}

function scrollHorizontally(e, el, checks) {
    // The actual scroll handler that scrolls based on a check
    e = window.event || e;
    if (!checks || getScrollParent(e.target) === null) {
        e.preventDefault();
        el.scrollLeft -= e.wheelDelta || -e.detail;
    }
}

function getScrollParent(node) {
    // Checks if a components is vertically scrollable
    if (node == null) return null;
    if (node.scrollHeight > node.clientHeight) return node;
    else return getScrollParent(node.parentNode);
}
