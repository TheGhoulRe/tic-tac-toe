import { useState } from 'react';
import ServerConnection from './Classes/ServerConnection';

const server = new ServerConnection(process.env.REACT_APP_BACKEND);

export default function Login ({setUser, setHost, history}) {
    const {push} = history;
    const [valid, setValid] = useState(true);
    return (
        <div className="multiplayer-login">
            <div>Enter your nickname</div><br />
            <input className="button" type="text" id="nickname" maxLength={16} onChange={() => setValid( validate(getUserName(), getGuestName())) } placeholder="your nickname..."/><br />
            <input className="button" type="text" id="guestname" maxLength={16} onChange={() => setValid( validate(getUserName(), getGuestName())) } placeholder="guest's nickname..."/><br />
            { !valid && <div className="warning-text" >The username or the guest name is invalid.</div> }
            <button className="button" disabled={!valid && 'disabled'} onClick={async () => await startGame(getUserName(), getGuestName(), push, setHost, setUser) }>Start Game</button>
        </div>
    );
}

function validate(username, guestname) {
    if (username === guestname) return false;
    else if ((username === "") || (guestname === "")) return false;
    else if (/[^a-zA-Z0-9]/.test(username) || /[^a-zA-Z0-9]/.test(guestname)) return false;
    return true;
}
function getUserName() {
    return document.getElementById("nickname").value;
}

function getGuestName() {
    return document.getElementById("guestname").value;
}

async function startGame(username, guestname, push, setHost, setUser) {
    // create user on the server and return the name of the username file
    await server.getFrom(`/adduser/${username}/${guestname}`);

    localStorage.username = username;
    localStorage.extraUser = guestname;

    setHost(guestname);
    setUser(username);

    push(`/game/${username}/${guestname}`);
}