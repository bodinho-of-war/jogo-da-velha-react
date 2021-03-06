import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
    return (
    <button style={{color: props.highlight? 'green': 'black'}}
        className="square" onClick={props.onClick}>
        {props.value}
    </button>
    );

  }
  
  class Board extends React.Component {

    renderSquare(i, highlight) {
      return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={highlight}
        />)
    }
  
    render() {
      const line = this.props.line? this.props.line : [false, false, false]
      const squares = this.props.squares.map((square, index) => {
        return this.renderSquare(index, line.includes(index))
      })
      const rows = []
      for (let index = 0; index < 3; index++) {
        rows.push(<div className="board-row">
          {squares.splice(0, 3)}
        </div>)
      }
      return (
        <div>
          {rows}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                col: 0,
                row: 0,
            }],
            stepNumber: 0,
            xIsNext: true
        }
    }

    checkColumnRow(i) {
      let cl, rw
      
      if(i < 3) {
        rw = 1
        cl = i + 1
      } else if (i > 5) {
        rw = 3
        cl = i - 5
      } else {
        rw = 2
        cl = i - 2
      }
      return {cl: cl, rw: rw}
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1]
        const squares = current.squares.slice()
        if(calculateWinner(squares) || squares[i]) {
            return 
        }
        squares[i] = this.state.xIsNext? 'X' : 'O'
        const {cl, rw} = this.checkColumnRow(i)
        
        this.setState({
            history: history.concat([
                {
                  squares,
                  col: cl,
                  row: rw
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            selected: step
        })
    }

    setReverse() {
      this.setState({
        reverse: !this.state.reverse
      })
    }

    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)

        const moves = history.map(
            (step, move) => {
                const desc = move?
                `Go to move #${move} Column:${step.col} x Row:${step.row}`:
                'Go to game start'
                return (
                    <li key={move}>
                        <button style={{'fontWeight': this.state.selected === move ? 'bold' : 'normal'}}
                        onClick={() => {this.jumpTo(move)}}>{desc}</button>
                    </li>
                )
            }
        )
        
        const sort = <button onClick={() => this.setReverse()}>{this.state.reverse? 'Crescente' : 'Decrescente'}</button>

        let status
        if(winner) {
          status = `Winner: ${winner.player}`
        } else if (!this.state.history[this.state.history.length - 1].squares.includes(null)) {
          status =`Draw!`;
        } 
        else {
          status =`Next player: ${this.state.xIsNext? 'X' : 'O'}`;
        }
        const list = this.state.reverse? <ol reversed> {moves.reverse()} </ol> : <ol>{moves}</ol>
      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares={current.squares} 
                onClick={(i) => this.handleClick(i)}
                line={winner? winner.line : null}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <br/>
            <div>{sort}</div>
            {list}
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {player: squares[a], line: lines[i]};
      }
    }
    return null;
  }