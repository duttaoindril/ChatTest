import React, { Component } from "react";
import ChatBoxSmartReplies from "./ChatBoxSmartReplies.jsx";
class ChatBox extends Component {
    state = {
        lastRecievedTime: getSecondsSince(this.props.state.conversations[this.props.state.currentUser].lastRecieved),
        lastSentTime: getSecondsSince(this.props.state.conversations[this.props.state.currentUser].lastSent)
    };
    componentDidMount() {
        this.interval = setInterval(
            () =>
                this.setState({
                    lastRecievedTime: getSecondsSince(this.props.state.conversations[this.props.state.currentUser].lastRecieved),
                    lastSentTime: getSecondsSince(this.props.state.conversations[this.props.state.currentUser].lastSent)
                }),
            1000
        );
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render() {
        return (
            <div id="chatsend">
                <img src={this.props.face} alt="Placeholder Customer Avatar" onClick={e => this.props.switchTo(this.props.state.currentUser)} />
                <div
                    id="chatdetails"
                    className={"material padCont user" + this.props.state.currentUser}
                    onClick={e => this.props.switchTo(this.props.state.currentUser)}>
                    <h3>
                        {this.props.state.conversations[this.props.state.currentUser].name +
                            " - #" +
                            (parseInt(this.props.state.currentUser, 10) + 1)}
                    </h3>
                    <p>{this.state.lastSentTime + "s ago last sent"}</p>
                    <p>{this.state.lastRecievedTime + "s ago last recieved"}</p>
                </div>
                <ChatBoxSmartReplies data={this.props.state} replies={this.props.replies} onclick={i => this.props.smrplyClick(i)} />
            </div>
        );
    }
}
export default ChatBox;
const getSecondsSince = time => Math.floor((Date.now() - time) / 1000);
