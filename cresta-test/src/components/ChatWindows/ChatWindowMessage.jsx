import React from "react";
const ChatWindowMessage = props => (
    <div className={"material box padBox" + (props.data.sent === -1 ? " user" : " customer") + (props.data.temp ? " temp" : "")}>
        {props.data.text}
    </div>
);
export default ChatWindowMessage;
