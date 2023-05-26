import React from 'react';
import "./GameOver.css";
import { initialChessboard } from '../../Constants';

export default function GameOver({ setGameOver, gameOver, setChessboard, setMoveList, setTurn}) {
    const isDraw = gameOver === 'draw' ? <span>{gameOver}</span> : <span>{gameOver} team won</span>;
    function restartGame() {
        setGameOver(null);
        setChessboard(() => {
            const clonedChessboard = initialChessboard.clone();
            initialChessboard.totalTurns = 1;
            initialChessboard.moveList = [];
            setMoveList([]);
            setTurn("white");
            clonedChessboard.getPossibleMoves();
            return clonedChessboard;
        });
    }
    return (
        <div className='checkmate-card'>
            <div className='checkmate-card-body'>
                {isDraw}
                <button onClick={restartGame}>Play again</button>
            </div>
        </div>
    )
}
