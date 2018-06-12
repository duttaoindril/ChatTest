import React from "react";
import ChatQueueItem from "./ChatQueueItem.jsx";
const ChatQueue = props => (
    <div id="sidebar">
        <div className="material container padBox">
            {props.queue.map((item, index) => (
                <ChatQueueItem key={item.name + item.userId} data={item} face={props.face} onclick={i => props.windowClick(i)} />
            ))}
        </div>
    </div>
);
export default ChatQueue;
