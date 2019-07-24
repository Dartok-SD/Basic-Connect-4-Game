import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import React from 'react';
import ReactDOM from 'react-dom';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}
class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
        };
    }

    renderSquare(i) {
        return( <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
        />
    );
    }

    render() {
        let x = [];
        for(var row = 0 ; row<6; row++) {
            let boardRow = [];
            for(var col = 0; col < 7;col++) {
                boardRow.push(<span key={(row * 7) + col}>{this.renderSquare((row * 7) + col)}</span>);
            }
            x.push(<div className="board-row" key={row}>{boardRow}</div>);
        }
        return (
            <div>
                {x}
                {/*<div className="board-row">*/}
                {/*    {this.renderSquare(0)}*/}
                {/*    {this.renderSquare(1)}*/}
                {/*    {this.renderSquare(2)}*/}
                {/*</div>*/}
                {/*<div className="board-row">*/}
                {/*    {this.renderSquare(3)}*/}
                {/*    {this.renderSquare(4)}*/}
                {/*    {this.renderSquare(5)}*/}
                {/*</div>*/}
                {/*<div className="board-row">*/}
                {/*    {this.renderSquare(6)}*/}
                {/*    {this.renderSquare(7)}*/}
                {/*    {this.renderSquare(8)}*/}
                {/*</div>*/}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        i = setBottom(i,squares);
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (

            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
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

function setBottom(i, squares) {
    var returnBottom = i;
    while(i+7 < 42 && !squares[i+7]) {
        i = i+7;
    }
    return i;
}

function calculateWinner(squares) {
    // const lines = [
    //     [0, 1, 2],
    //     [3, 4, 5],
    //     [6, 7, 8],
    //     [0, 3, 6],
    //     [1, 4, 7],
    //     [2, 5, 8],
    //     [0, 4, 8],
    //     [2, 4, 6],
    // ];
    // for (let i = 0; i < lines.length; i++) {
    //     const [a, b, c] = lines[i];
    //     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
    //         return squares[a];
    //     }
    // }
    // Vertical Check
    for (let i = 0; i < 4; i++) {
        for(let j = 0; j < 6; j++) {
            var num = i+(j*7);
            if (squares[num] &&
                squares[num] === squares[num + 1] &&
                squares[num] === squares[num + 2] &&
                squares[num] === squares[num + 3])
                return squares[num];
        }
    }
    // Horizontal Check
    for (let i = 0; i < 3; i++) {
        for(let j = 0; j < 7; j++) {
            var num = i*7+(j);
            if (squares[num] &&
                squares[num] === squares[num + 7] &&
                squares[num] === squares[num + 14] &&
                squares[num] === squares[num + 21])
                return squares[num];
        }
    }

    // First Diagonal Check
    for (let i = 0; i < 4; i++) {
        for(let j = 0; j < 3; j++) {
            var num = i+(j*7);
            if (squares[num] &&
                squares[num] === squares[num + 8] &&
                squares[num] === squares[num + 16] &&
                squares[num] === squares[num + 24])
                return squares[num];
        }
    }
    // Second Diagonal Check
    for (let i = 3; i < 7; i++) {
        for(let j = 0; j < 3; j++) {
            var num = i+(j*7);
            if (squares[num] &&
                squares[num] === squares[num + 6] &&
                squares[num] === squares[num + 12] &&
                squares[num] === squares[num + 18])
                return squares[num];
        }
    }
    return null;
}