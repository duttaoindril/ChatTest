import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
function calculateWinner(squares) {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return [squares[a], lines[i]];
    }
    return [null, null];
}
function Square(props) {
    return (
        <button className={"square " + props.bold} onClick={props.onClick}>
            {props.value}
        </button>
    );
}
class Board extends React.Component {
    renderSquare(i, bold) {
        return <Square key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} bold={bold} />;
    }
    getBold(current) {
        var winner = calculateWinner(this.props.getBoard());
        return winner[1] && winner[1].indexOf(current) > -1 ? "bold" : "";
    }
    renderBoard(numrows, numcols) {
        var rows = [];
        for (var i = 0; i < numrows; i++) {
            var currentRow = [];
            for (var j = 0; j < numcols; j++)
                currentRow.push(this.renderSquare(i * numrows + j, this.getBold(i * numrows + j)));
            rows.push(
                <div className="board-row" key={"row" + i}>
                    {currentRow}
                </div>
            );
        }
        return rows;
    }
    render() {
        return <div>{this.renderBoard(this.props.rows, this.props.cols)}</div>;
    }
}
class Game extends React.Component {
    static getDefault() {
        return {
            history: [],
            xIsNext: true,
            stepNumber: 0,
            ascending: false
        };
    }
    constructor(props) {
        super(props);
        this.state = Game.getDefault();
    }
    reset() {
        this.setState(Game.getDefault());
    }
    flipOrder() {
        this.setState({
            ascending: !this.state.ascending
        });
    }
    getBoard(maximum) {
        var max = Number.isInteger(maximum) ? maximum : this.state.history.length;
        var moves = {};
        for (var i = 0; i < max; i++)
            moves[Object.keys(this.state.history[i])[0]] = Object.values(this.state.history[i])[0];
        var board = Object.assign([...Array(this.props.cols * this.props.rows).fill("")], moves);
        return board;
    }
    handleClick(i) {
        if (!calculateWinner(this.getBoard())[0] && !this.getBoard()[i])
            this.setState({
                history: Object.assign([...this.state.history], {
                    [this.state.history.length]: { [i]: this.state.xIsNext ? "X" : "O" }
                }),
                xIsNext: !this.state.xIsNext,
                stepNumber: this.state.stepNumber + 1
            });
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0
        });
    }
    renderJumpButton(i, move, bold) {
        var coords = "";
        if (move) {
            var num = parseInt(Object.keys(move)[0], 10);
            var numm = Math.floor(num / this.props.rows) * this.props.cols;
            coords = " (" + (num - numm) + ", " + Math.floor(num / this.props.rows) + ")";
        }
        return (
            <li key={i}>
                <button className={bold ? "bold" : ""} onClick={() => this.jumpTo(i)}>
                    {i ? "Go to move #" + i + coords : "Go to game start"}
                </button>
            </li>
        );
    }
    render() {
        const current = this.getBoard(this.state.stepNumber);
        const winner = calculateWinner(current)[0];
        var moves = [];
        var done = this.state.history.length === this.props.cols * this.props.rows;
        if (calculateWinner(this.getBoard())[0] || done) {
            for (var i = -1; i < this.state.history.length; i++)
                moves.push(
                    this.renderJumpButton(
                        (this.state.ascending ? i : this.state.history.length - i - 2) + 1,
                        this.state.history[this.state.ascending ? i : this.state.history.length - i - 2],
                        (this.state.ascending ? i : this.state.history.length - i - 2) + 1 === this.state.stepNumber
                    )
                );
            moves.push(
                <div>
                    <input type="checkbox" id="toggly" onClick={() => this.flipOrder()} />
                    <label htmlFor="toggly">
                        <i />
                    </label>
                    <p>{this.state.ascending ? "Ascending" : "Descending"}</p>
                </div>
            );
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current}
                        cols={this.props.cols}
                        rows={this.props.rows}
                        getBoard={i => this.getBoard(i)}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>
                        {winner
                            ? "Winner is Player " + winner + "!"
                            : done
                                ? "The match is a draw!"
                                : "Next up is player " + (this.state.xIsNext ? "X" : "O")}
                    </div>
                    <button onClick={() => this.reset()}>Reset the Game</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}
// ==================================================
// cls && cd react-app-generated\my-app && npm start
// cls && npm start
// ==================================================
var size = 3; //10;
ReactDOM.render(<Game cols={size} rows={size} />, document.getElementById("root"));
