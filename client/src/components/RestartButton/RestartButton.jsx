import React, { useRef } from 'react';
import { initialChessboard } from '../../Constants';
import "./RestartButton.css";

export default function RestartButton({ setMoveList, setTurn, setGameOver, setChessboard, room, gameOver}) {
    const buttonRef = useRef(null);
    if(room && buttonRef.current) buttonRef.current.classList.add("online-culumn-position", "hidden");

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
        if(!room) return;
        
    }
    return <button ref={buttonRef} className='restart-button' onClick={restartGame}>Play again</button> 
}
