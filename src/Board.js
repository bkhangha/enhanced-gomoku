import Square from "./Square";

const BOARD_SIZE = 5;

export default function Board(props) {
    const renderSquare = (i) => {
        return (
            <Square
                isWinning={props.winningSquares.includes(i)}
                key={"square " + i}
                value={props.squares[i]}
                onClick={() => props.onClick(i)}
            />
        );
    } 

    const renderRows = (size) => {
        const rows = [];
        for (let i = 0; i < size; i++) {
            let row = [];
            for (let j = 0; j < size; j++) {
                row.push(renderSquare(i * size + j));
            }
            rows.push(
                <div key={i} className="board-row">
                    {row}
                </div>
            )
        }
        return rows;
    }

    // const render = () => {
        return (
            <div>
                <div>
                    {renderRows(BOARD_SIZE)}
                </div>
            </div>
        );
    // }

    
}
