import React from 'react';
import "./GameOver.css";
import { initialChessboard } from '../../Constants';

export default function GameOver({checkmateRef, winningTeam, setChessboard, setMoveList}) {
    const isDraw = winningTeam ? <span>{winningTeam} team won</span> : <span>Draw</span>;
    function restartGame() {
        checkmateRef.current.classList.add("hidden");
        setChessboard(() => {
            const clonedChessboard = initialChessboard.clone();
            initialChessboard.totalTurns = 1;
            initialChessboard.moveList = [];
            setMoveList([]);
            return clonedChessboard;
        });
    }
    return (
        <div className='checkmate-card hidden' ref={checkmateRef}>
            <div className='checkmate-card-body'>
                {isDraw}
                <button onClick={restartGame}>Play again</button>
            </div>
        </div>
    )
}
