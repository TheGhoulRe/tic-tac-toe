import ServerConnection from "./Classes/ServerConnection";

const server = new ServerConnection(process.env.REACT_APP_BACKEND);

export default function GuestLogin ({setUser, setHost, history, match}) {
    const {replace} = history;
    const {host, guest} = match.params;
    startGame(guest, host, replace, setHost, setUser);
    return <div></div>;
}

async function startGame(username, host, replace, setHost, setUser) {
    // set current guest user of the host user to the server
    await server.getFrom(`/addguest/${host}/${username}`);

    // set current user to the username
    localStorage.username = username;
    localStorage.extraUser = host;

    // set set current host to url acquired host
    setHost(host);
    setUser(username);

    // route to the game screen
    replace(`/game/${host}/${username}`);
}