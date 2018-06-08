import React from "react";
const ChatBar = props => (
    <div id="chatboxbar">
        <div className={"material box padCont user" + props.state.currentUser} id="chatbar">
            <input
                name="chat"
                id="chatboxinput"
                autoFocus
                spellCheck
                type="text"
                placeholder="Chat here..."
                onChange={props.onType}
                value={props.state.currentText}
            />
        </div>
    </div>
);
export default ChatBar;
