import React from "react";
import ReactMarkdown from "react-markdown";
const ChatWindowMessage = props => (
    <ReactMarkdown
        className={"material box padBox" + (props.data.sent === -1 ? " user" : " customer") + (props.data.temp ? " temp" : "")}
        source={props.data.text}
    />
);
export default ChatWindowMessage;
// <div className={"material box padBox" + (props.data.sent === -1 ? " user" : " customer") + (props.data.temp ? " temp" : "")}>{props.data.text}</div>
