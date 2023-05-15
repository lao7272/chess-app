import React from 'react';
import "./Endgame.css";

export default function Endgame({checkmateRef, winningTeam, restartGame}) {
    const isDraw = winningTeam ? <span>{winningTeam} team won</span> : <span>Draw</span>;
    return (
        <div className='checkmate-card hidden' ref={checkmateRef}>
            <div className='checkmate-card-body'>
                {isDraw}
                <button onClick={restartGame}>Play again</button>
            </div>
        </div>
    )
}
