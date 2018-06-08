// import React from "react";
// import ReactDOM from "react-dom";
// import "./index.css";

// function calculateWinner(squares) {
//     const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
//     for (let i = 0; i < lines.length; i++) {
//         const [a, b, c] = lines[i];
//         if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
//     }
//     return null;
// }

// function Square(props) {
//     return (
//         <button className="square" onClick={props.onClick}>
//             {props.value}
//         </button>
//     );
// }

// class Board extends React.Component {
//     renderSquare(i) {
//         return <Square key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
//     }
//     renderBoard(numrows, numcols) {
//         var rows = [];
//         for (var i = 0; i < numrows; i++) {
//             var currentRow = [];
//             for (var j = 0; j < numcols; j++) currentRow.push(this.renderSquare(i * numrows + j));
//             rows.push(
//                 <div className="board-row" key={"row" + i}>
//                     {currentRow}
//                 </div>
//             );
//         }
//         return rows;
//     }
//     render() {
//         return <div>{this.renderBoard(this.props.rows, this.props.cols)}</div>;
//     }
// }

// class Game extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             history: [{ squares: Array(this.props.cols * this.props.rows).fill("") }],
//             xIsNext: true,
//             stepNumber: 0
//         };
//     }
//     handleClick(i) {
//         if (!calculateWinner(this.state.history.slice(-1)[0].squares) && !this.state.history.slice(-1)[0].squares[i])
//             this.setState({
//                 history: Object.assign([...this.state.history], {
//                     [this.state.history.length]: {
//                         squares: Object.assign([...this.state.history.slice(-1)[0].squares], {
//                             [i]: this.state.xIsNext ? "X" : "O"
//                         })
//                     }
//                 }),
//                 xIsNext: !this.state.xIsNext,
//                 stepNumber: this.state.history.length
//             });
//     }
//     jumpTo(step) {
//         this.setState({
//             stepNumber: step,
//             xIsNext: step % 2 === 0
//         });
//     }
//     render() {
//         const current = this.state.history[this.state.stepNumber].squares;
//         const winner = calculateWinner(current);
//         const moves = this.state.history.map((step, move) => {
//             return (
//                 <li key={move}>
//                     <button onClick={() => this.jumpTo(move)}>{move ? "Go to move #" + move : "Go to game start"}</button>
//                 </li>
//             );
//         });
//         return (
//             <div className="game">
//                 <div className="game-board">
//                     <Board cols={this.props.cols} rows={this.props.rows} squares={current} onClick={i => this.handleClick(i)} />
//                 </div>
//                 <div className="game-info">
//                     <div>{winner ? "Winner is Player " + winner + "!" : "Next up is player " + (this.state.xIsNext ? "X" : "O")}</div>
//                     <ol>{moves}</ol>
//                 </div>
//             </div>
//         );
//     }
// }
// // ==================================================
// // cls && cd react-app-generated\my-app && npm start
// // cls && npm start
// // ==================================================
// var size = 3;
// ReactDOM.render(<Game cols={size} rows={size} />, document.getElementById("root"));
