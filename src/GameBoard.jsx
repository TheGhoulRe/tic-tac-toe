
function prepare(text) {
    if( text === "X" ) {
        return <div className="bi-x X"></div>
    }else if (text === "O") {
        return <div className="bi-circle O"></div>
    }else{
        return text;
    }
}

export default function GameBoard(props) {
    return (
        <table>
            <tbody>
                <tr>
                    <td className="a" onClick={() =>props.handleCellClick(0)}>{prepare(props.table[0])}</td>
                    <td className="b" onClick={() =>props.handleCellClick(1)}>{prepare(props.table[1])}</td>
                    <td className="c" onClick={() =>props.handleCellClick(2)}>{prepare(props.table[2])}</td>
                </tr>
                <tr>
                    <td className="d" onClick={() =>props.handleCellClick(3)}>{prepare(props.table[3])}</td>
                    <td className="e" onClick={() =>props.handleCellClick(4)}>{prepare(props.table[4])}</td>
                    <td className="f" onClick={() =>props.handleCellClick(5)}>{prepare(props.table[5])}</td>
                </tr>
                <tr>
                    <td className="g" onClick={() =>props.handleCellClick(6)}>{prepare(props.table[6])}</td>
                    <td className="h" onClick={() =>props.handleCellClick(7)}>{prepare(props.table[7])}</td>
                    <td className="i" onClick={() =>props.handleCellClick(8)}>{prepare(props.table[8])}</td>
                </tr>
            </tbody>
        </table>
    );
}