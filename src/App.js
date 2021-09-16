import './App.css';
import { Switch, Route } from 'react-router-dom';
import GuestLogin from './GuestLogin';
import Login from './Login';
import CPUGame from './CPUGame';
import LocalGame from './LocalGame';
import Game from './Game';
import Heading from './Heading';
import Home from './Home';
import { useState } from 'react';
import './bootstrap-icons/bootstrap-icons.css';

function App() {
  const [user, setUser] = useState(localStorage.username);
  const [host, setHost] = useState(localStorage.extraUser);
  const [whoseTurn, setWhoseTurn] = useState("");
  // user
  // host state   // only when in guest screen
  return (
    <div>
      {/* Heading (props) currentUser (get guestUser()) host whoseTurn */}
      <Heading currentUser={user} guestUser={host} whoseTurn={whoseTurn} />

      {/* Routes */}
      <Switch>
        {/* guestLogin (props) host setCurrentUser setCurrentHost */}
        <Route path="/guest/:host/:guest" render={(props) => <GuestLogin setUser={setUser} setHost={setHost} {...props} />} />

        {/* game (props) setUserTurn */}
        <Route path="/game/:host/:guest" render={(props) => <Game user={user} extrauser={host} changeWhoseTurn={data => setWhoseTurn(data)} {...props} />} />
        <Route path="/localgame" component={LocalGame} />
        <Route path="/cpugame" render={(props) => <CPUGame user={user} extrauser={host} changeWhoseTurn={data => setWhoseTurn(data)} {...props} />} />
        <Route path="/multiplayergame" render={(props) => <Login setUser={setUser} setHost={setHost} {...props} />} />
        {/* login (props) setCurrentUser */}
        <Route path="/" component={Home} />
      </Switch>
      {/* Routes */}
    </div>
  );
}


export default App;
