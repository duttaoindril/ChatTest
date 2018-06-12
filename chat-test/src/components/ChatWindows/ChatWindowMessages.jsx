import React from "react";
import ChatWindowMessage from "./ChatWindowMessage.jsx";
const ChatWindowMessages = props => (
    <div className="messages">
        {props.data.conversation.map((message, index) => <ChatWindowMessage data={message} key={index} />)}
        {props.state.currentText &&
            props.state.currentUser === props.data.id && <ChatWindowMessage data={{ sent: -1, text: props.state.currentText, temp: true }} />}
        {props.data.typing && <ChatWindowMessage data={{ sent: props.data.id, text: props.data.typing, temp: true }} />}
    </div>
);
export default ChatWindowMessages;
