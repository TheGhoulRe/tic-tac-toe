import { Component } from 'react';
import GameBoard from './GameBoard';
import './App.css'
import winningMove from './Rules';

export default class App extends Component {

  state = {
    table: [
        ' ', ' ', ' ',
        ' ', ' ', ' ',
        ' ', ' ', ' '
    ], 
    isXturn: true,
    progress: 0,
    ended: false,
    started: false
  };

  

  handleCellClick = async (pos) => {
    if (this.state.progress <= 8 && this.state.table[pos] === ' ' && !this.state.ended ) {
      let stateClone = { ...this.state };
      stateClone.table[pos] = stateClone.isXturn ? 'X' : 'O';
      stateClone.isXturn = !stateClone.isXturn;
      stateClone.progress++;

      if( winningMove(stateClone.table) )
        stateClone.ended = true;
      if( stateClone.progress > 8 )
        stateClone.ended = true;

      this.setState({...stateClone, started: true});
      this.waitForNextMove();
    }
  };

  cpuClick = (pos) => {
    if (!this.state.isXturn) {
      if (this.state.progress <= 8 && this.state.table[pos] === ' ' && !this.state.ended ) {
        let stateClone = { ...this.state };
        stateClone.table[pos] = stateClone.isXturn ? 'X' : 'O';
        stateClone.isXturn = !stateClone.isXturn;
        stateClone.progress++;

        if( winningMove(stateClone.table) )
          stateClone.ended = true;
        if( stateClone.progress > 8 )
          stateClone.ended = true;

        this.setState(stateClone);
      }
    }
  };

  sleep(val) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), val);
    });
  }

  async waitForNextMove() {
      const nm = () => {
        const res = parseInt((Math.random() * 9).toString());
        if (this.state.table[res] === " "){
          return res;
        }else{
          let pos = nm();
          return pos;
        }
      };
      let pos = nm();
      await this.sleep(1000);
      this.cpuClick(pos);
  }

  resetState = () => {
    this.setState({
      table: [
        ' ', ' ', ' ',
        ' ', ' ', ' ',
        ' ', ' ', ' '
      ], 
      isXturn: this.state.isXturn,
      progress: 0,
      ended: false,
      started: false,
    });
  };

  isEmpty(table, start=0) {
    if (table.length === start) return true;
    else if (table[start] !== ' ' ) return false;
    else return this.isEmpty(table, start + 1)
  }

  render () {

    if (!this.state.started && this.isEmpty(this.state.table) && !this.state.isXturn) {
      this.waitForNextMove();
      this.setState({...this.state, started: true});
    }

    return (
      <div>
        <center>
          <h1>Game</h1>
          <GameBoard handleCellClick={(pos) => { if(this.state.isXturn) this.handleCellClick(pos); }} table={this.state.table}/>
          <h1>
          {
            this.state.ended ? 
              (this.state.progress <= 8) ? 
                (!this.state.isXturn ? 'X won' : 'O won') 
              :
                'it\'s a draw!'
            : 
              `is ${this.state.isXturn ? 'X' : 'O'} turn`
          }
          </h1>
          { this.state.ended && <button onClick={this.resetState} className="resetButton">Reset</button> }
        </center>
      </div>
    );

  }

}