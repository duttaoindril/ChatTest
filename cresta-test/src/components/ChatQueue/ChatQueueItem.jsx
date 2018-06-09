import React from "react";
import ReactMarkdown from "react-markdown";
const ChatQueueItem = props => (
    <div className={"material box padBox queueMessage user" + props.data.userId} onClick={e => props.onclick(props.data.userId)}>
        <img src={props.face} alt="Placeholder Customer Avatar" />
        <div className="box">
            <h3>{props.data.name}</h3>
            <ReactMarkdown className="msg" source={props.data.lastMessage} />
            {/* <div className="msg"><p>{props.data.lastMessage}</p></div> */}
            <p>{capFirst(props.data.mood)}</p>
            <p className={"material padContSmll priority " + props.data.priority}>{capFirst(props.data.priority) + " Priority"}</p>
        </div>
    </div>
);
export default ChatQueueItem;
const capFirst = string => string[0].toUpperCase() + string.substr(1);
