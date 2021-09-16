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
    ended: false
  };
  handleCellClick = pos => {
    if (this.state.progress <= 8 && this.state.table[pos] === ' ' && !this.state.ended ) {
      let stateClone = { ...this.state };
      stateClone.table[pos] = stateClone.isXturn ? 'X' :  'O';
      stateClone.isXturn = !stateClone.isXturn;
      stateClone.progress++;

      if( winningMove(stateClone.table) )
        stateClone.ended = true;
      if( stateClone.progress > 8 )
        stateClone.ended = true;
      
      this.setState(stateClone);
    }
  };

  resetState = () => {
    this.setState({
      table: [
        ' ', ' ', ' ',
        ' ', ' ', ' ',
        ' ', ' ', ' '
      ], 
      isXturn: this.state.isXturn,
      progress: 0,
      ended: false
    });
  };

  render () {

    return (
      <div>
        <center>
          <h1>Local Play</h1>
          <GameBoard handleCellClick={this.handleCellClick} table={this.state.table}/>
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