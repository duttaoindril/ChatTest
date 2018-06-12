import React from "react";
const ChatBoxSmartReply = props => (
    <p className={"smrply user" + props.data.user + " box padCont"} onClick={e => props.onclick(props.data)}>
        {'"' + props.data.text + '" - #' + (props.data.user + 1)}
    </p>
);
export default ChatBoxSmartReply;
