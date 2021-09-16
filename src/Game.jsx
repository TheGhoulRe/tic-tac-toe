import { useEffect, useState } from 'react';
import GameBoard from './GameBoard';
import './App.css'
import winningMove from './Rules';
import EventEmitter from 'events';
import ServerConnection, { RecurringServerConnection } from './Classes/ServerConnection';
const server = new ServerConnection(process.env.REACT_APP_BACKEND);
const rsc = new RecurringServerConnection(process.env.REACT_APP_BACKEND, 3000);
const emitter = new EventEmitter();

const data = {host: "", guest: ""};
window.addEventListener('beforeunload', () => {
  if (data["host"] !== "" && data["guest"] !== "" ) server.getFrom(`/endgame/${data["host"]}/${data["guest"]}`);
});

export default function Game(props) {
    const {params} = props.match;
    const {user, changeWhoseTurn} = props;
    const {host, guest} = params;
    
    const [table, setTable] = useState([' ', ' ', ' ',' ', ' ', ' ',' ', ' ', ' ']);
    const [ended, setEnded] = useState(false);
    const [progress, setProgress] = useState(0);
    const [display, setDisplay] = useState("block");
    const [disconnected, setDisconnected] = useState(false);
    const [isXturn, setIsXturn] = useState(true);
    const [stat, setStat] = useState(false);
    const [sdaWhoseTurn, changeSdaWhoseTurn] = useState("");
    const [displayStat, setDisplayStat] = useState(true);
    const [awaitResetStat, setAwaitResetStat] = useState(false);

    const allSetValues = [setTable, setEnded, setProgress, setIsXturn, setStat, setAwaitResetStat];

    emitter.on('started', () => {
      data["host"] = host;
      data["guest"] = guest;
    });

    const allowIfActive = async () => {
      rsc.getFrom(`/guestactive/${host}/${guest}`, (res) => {
        const intRes = parseInt(res);
        if (intRes){
          rsc.stop();
          isDisconnected(); 
          emitter.emit('started');
          setDisplay("none");
        }
      });
    };

    const isDisconnected = async () => {
      if (!disconnected){
        setDisconnected(true);
        rsc.getFrom(`/guestactive/${host}/${guest}`, (res) => {
          server.getFrom(`/ifhasleft/${host}/${guest}`);
          const intRes = parseInt(res);
          if (!intRes) {
            changeSdaWhoseTurn("disconnected");
            rsc.stop();
          }
        });
      }
    };

    const awaitReset = async () => {
      await sleep(1000);
      let res = parseInt((await server.getFrom(`/ifreset/${host}/${guest}/${user}`)));
      if (ended) {
        if (res) return resetStateReceived(allSetValues, changeSdaWhoseTurn, (user === host) ? guest :host );
        else return awaitReset();
      } else return null;
    }

    useEffect(() => {
      const cTurn = isXturn ? host : guest;
      if ( !stat && isEmpty(table) && (user !== cTurn) ){
        setStat(true);
        waitForNextMove(table, ended, progress, isXturn, allSetValues, host, guest, user);
      }
      if (displayStat) {
        setDisplayStat(false);
        allowIfActive();
      }
      if (ended && !awaitResetStat) {
        setAwaitResetStat(true);
        awaitReset();
      }
    });
    
    

    return render(sdaWhoseTurn, display, table, ended, progress, isXturn, params,allSetValues, user, changeWhoseTurn);
}

function render (sdaWhoseTurn, display, table, ended, progress, isXturn, params, allSetValues, user, changeWhoseTurn) {
    const {host, guest} = params;
    const {innerHeight, innerWidth} = window;
    return (
      <div id="game">
        <center>
          <h1>Game</h1>
          <GameBoard handleCellClick={pos => {if (((user === host) && isXturn) || ((user === guest) && !isXturn)) handleCellClick(pos, table, ended, progress, isXturn, allSetValues, host, guest, user)}} table={table}/>
          <h1>
          {
            ended ? 
              (progress <= 8 || winningMove(table)) ? 
                changeWhoseTurn(!isXturn ? host + ' won' : guest + ' won') 
              :
                changeWhoseTurn('it\'s a draw!')
                
            : changeWhoseTurn(`${isXturn ? host : guest } turn`)
          }
          </h1>
          {sdaWhoseTurn}
          { ended && <button className="resetButton" onClick={() => resetState(ended, host, guest, allSetValues, user) } >Reset</button> }
        </center>
        <div className="first-prompt" style={{display}}>
          <div style={{top: `${innerHeight/2 - 50}px`}} className="waiting-screen">
            <div className="waiting-for-guest-text">waiting for {guest}...</div><br />
            copy the url below <br /><div id="link">{process.env.REACT_APP_FRONTEND}/guest/{host}/{guest}</div><br/>
            <button  id="button" onClick={async () => {
              document.getElementById("link").select();
              try{
                /* Note: Implement this */
                document.execCommand('copy');
                document.getElementById("button").innerHTML = "Copied"
              }catch(err) {
                // console.error(err);
                document.getElementById("button").innerHTML = "Failed to copy"
              }
              }}>Copy Invite link</button>
          </div>
        </div>
      </div>
    );
}

async function resetState (ended, host, guest, allSetValues, user) {
    const [setTable, setEnded, setProgress, setIsXturn, setStat, setAwaitResetStat] = allSetValues;
    setTable([' ', ' ', ' ',' ', ' ', ' ',' ', ' ', ' ']);
    setProgress(0);
    setEnded(false);
    setStat(false);
    setAwaitResetStat(false);
    await server.getFrom(`/reset/${host}/${guest}/${user}`);
    // awaitReset(ended, host, guest, user, allSetValues);
}

async function resetStateReceived (allSetValues, changeSdaWhoseTurn, user) {
    const [setTable, setEnded, setProgress, setIsXturn, setStat, setAwaitResetStat] = allSetValues;
    setTable([' ', ' ', ' ',' ', ' ', ' ',' ', ' ', ' ']);
    setProgress(0);
    setEnded(false);
    setStat(false);
    setAwaitResetStat(false);
    changeSdaWhoseTurn(`${user} reset the game.`);
    await sleep(3000);
    changeSdaWhoseTurn(``);
    // awaitReset(ended, host, guest, user, allSetValues);
}

async function handleCellClick (pos, table, ended, progress, isXturn, allSetValues, host, guest, user) {
    if (progress <= 8 && table[pos] === ' ' && !ended ) {
      // console.log(pos);
      const char = isXturn ? 'X' : 'O';
      table[pos] = char;
      isXturn = !isXturn;
      progress++;

      await server.postDataTo(`/play/${host}/${guest}`, { name: user, pos, char });

      if( winningMove(table) )
          ended = true;
      if( progress > 8 )
          ended = true;
      
      const [setTable, setEnded, setProgress, setIsXturn] = allSetValues;
      setTable(table);
      setIsXturn(isXturn);
      setProgress(progress);
      setEnded(ended);
      const cTurn = isXturn ? host : guest;
      if (user !== cTurn) await waitForNextMove(table, ended, progress, isXturn, allSetValues, host, guest, user);
  }
}

function isEmpty(table, start=0) {
  if (table.length === start) return true;
  else if (table[start] !== ' ' ) return false;
  else return isEmpty(table, start + 1)
}

function sleep(val) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), val);
  });
}

function waitForNextMove(table, ended, progress, isXturn, allSetValues, host, guest, fuser) {
  const rsc = new RecurringServerConnection(process.env.REACT_APP_BACKEND, 1000);
  rsc.getFrom(`/collectupdate/${host}/${guest}/${fuser}`, (res) => {
    const intRes = parseInt(res);
    if (intRes > -1){
      const user = isXturn ? host : guest;
      rsc.stop();
      handleCellClick(intRes, table, ended, progress, isXturn, allSetValues, host, guest, user);
    }
  });
}