export default function Square(props) {
    return (
        <button
            className={"square " + (props.isWinning ? "win-square" : null)}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}