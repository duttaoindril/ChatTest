import React from "react";
import ChatBoxSmartReply from "./ChatBoxSmartReply.jsx";
const ChatBoxSmartReplies = props => (
    <div id="chatreplies">{props.replies.map((reply, index) => <ChatBoxSmartReply data={reply} key={index} onclick={i => props.onclick(i)} />)}</div>
);
export default ChatBoxSmartReplies;
