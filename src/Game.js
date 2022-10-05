import Board from "./Board";
import { useState } from "react";

const BOARD_SIZE = 5;
function Game() {
   
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [isDescending, setDescending] = useState(true);
    const [history, setPlaysHistory] = useState([{
            squares: Array(BOARD_SIZE * BOARD_SIZE).fill(null),
            lastPlay: null
    }
    ]);

    const handleClick = (i) => {
        const boardCoordinates = [
            [1, 1], [2, 1], [3, 1], [4, 1], [5, 1],
            [1, 2], [2, 2], [3, 2], [4, 2], [5, 2],
            [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
            [1, 4], [2, 4], [3, 4], [4, 4], [5, 4],
            [1, 5], [2, 5], [3, 5], [4, 5], [5, 5]
        ];

        const historys = history.slice(0, stepNumber + 1);
        const current = historys[historys.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = xIsNext ? "X" : "O";

        setPlaysHistory(historys.concat([{squares: squares, lastPlay: boardCoordinates[i]}]));
        setStepNumber(historys.length);
        setXIsNext(!xIsNext);
        
    }

    const sortHistory = () => {
        
        setDescending(!isDescending);
    }

    const jumpTo = (step) => {
        setStepNumber(step);
        setXIsNext((step % 2) === 0)
    }

    const calculateWinner = (squares) => {
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
                && squares[a] === squares[e]
            ) {
                return { player: squares[a], line: [a, b, c, d, e] };
            }
        }
        return null;
    }

    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
        const desc = move ?
            'Go to move #' + move + " at " + "(" + step.lastPlay + ")" :
            'Go to game start';
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>
                    {move === stepNumber ? <b>{desc}</b> : desc}
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
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    winningSquares={winner ? winner.line : []}
                    squares={current.squares}
                    onClick={i => handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>

                <button onClick={() => sortHistory()}>
                    Sort type: {isDescending ? "Descending" : "Asending"}
                </button>

                <ol>{isDescending ? moves : moves.reverse()}</ol>
            </div>
        </div>
    );
}

export default Game;