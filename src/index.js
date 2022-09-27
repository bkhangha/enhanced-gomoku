import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

//============================
// Hà Bảo Khang             ||
// MSSV: 19120252           ||
//============================

const BOARD_SIZE = 5;

function Square(props) {
    return (
        <button
            className={"square " + (props.isWinning ? "win-square" : null)}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                isWinning={this.props.winningSquares.includes(i)}
                key={"square " + i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div>
                    {this.renderRows(BOARD_SIZE)}
                </div>
            </div>
        );
    }

    renderRows(size) {
        const rows = [];
        for (let i = 0; i < size; i++) {
            let row = [];
            for (let j = 0; j < size; j++) {
                row.push(this.renderSquare(i * size + j));
            }
            rows.push(
                <div key={i} className="board-row">
                    {row}
                </div>
            )
        }
        return rows;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(BOARD_SIZE * BOARD_SIZE).fill(null)
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            isDescending: true
        };
    }

    handleClick(i) {
        const boardCoordinates = [
            [1, 1], [2, 1], [3, 1], [4, 1], [5, 1],
            [1, 2], [2, 2], [3, 2], [4, 2], [5, 2],
            [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
            [1, 4], [2, 4], [3, 4], [4, 4], [5, 4],
            [1, 5], [2, 5], [3, 5], [4, 5], [5, 5]
          ];

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    coordinate: boardCoordinates[i]
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    sortHistory() {
        this.setState({
            isDescending: !this.state.isDescending
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + " at " + "(" + history[move].coordinate + ")"
                : 'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {move == this.state.stepNumber ? <b>{desc}</b> : desc}
                    </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = "Winner: " + winner.player
        } else if (!current.squares.includes(null)) {
            status = "Draw!";
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        winningSquares={winner ? winner.line : []}
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>

                    <button onClick={() => this.sortHistory()}>
                        Sort type: {this.state.isDescending ? "Descending" : "Asending"}
                    </button>

                    <ol>{this.state.isDescending ? moves : moves.reverse()}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
    const lines = [
        // horizontal
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],
        // vertical
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],
        // diag
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20]

    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c, d, e] = lines[i];
        if (squares[a] && squares[a] === squares[b]
            && squares[a] === squares[c]
            && squares[a] === squares[d]
            && squares[a] === squares[e]) {
            return { player: squares[a], line: [a, b, c, d, e] };
        }
    }
    return null;
}
