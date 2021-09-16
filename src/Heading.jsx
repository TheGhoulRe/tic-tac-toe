export default function Heading (props) {
    const {whoseTurn, currentUser, guestUser} = props;
    return (
        <div className="header">
            {/* TicTacToe */}
            <div>
                <span className="bi-x-circle mainIconA"></span> <span className="bi-circle mainIconB"></span>
            </div>
            <div>{whoseTurn}</div>

            <div>{currentUser} { currentUser !== "" ? (guestUser === " vs ...waiting" ? "" : "vs " + guestUser) : "" }</div>
        </div>
    );
}