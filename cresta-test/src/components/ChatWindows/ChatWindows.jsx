import React from "react";
import ChatWindowMessages from "./ChatWindowMessages.jsx";
const ChatWindows = props => (
    <div id="chatread">
        <ul className="padBox">
            <li />
            <li />
            {props.state.conversations.map((chatWindow, index) => (
                <li
                    onClick={() => props.windowClick(chatWindow.id)}
                    className={"container material user" + chatWindow.id + (chatWindow.id === props.state.currentUser ? "" : " unselected")}
                    key={chatWindow.name + chatWindow.id}>
                    <img src={props.face} alt="Placeholder Customer Avatar" />
                    <h3>{chatWindow.name + " - #" + (chatWindow.id + 1)}</h3>
                    <hr />
                    <ChatWindowMessages data={chatWindow} state={props.state} />
                </li>
            ))}
            <li />
            <li />
        </ul>
    </div>
);
export default ChatWindows;
