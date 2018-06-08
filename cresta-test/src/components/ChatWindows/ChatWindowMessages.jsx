import React from "react";
import ChatWindowMessage from "./ChatWindowMessage.jsx";
const ChatWindowMessages = props => (
    <div className="messages">
        {props.data.map((message, index) => <ChatWindowMessage data={message} key={index} />)}
        {props.state.currentText &&
            props.state.currentUser === props.id && <ChatWindowMessage data={{ sent: -1, text: props.state.currentText, temp: true }} key="temp" />}
    </div>
);
export default ChatWindowMessages;
