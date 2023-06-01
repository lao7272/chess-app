import React, { useRef } from 'react';
import { initialChessboard } from '../../Constants';
import "./RestartButton.css";

export default function RestartButton({ setMoveList, setTurn, setGameOver, setChessboard, room}) {
    const buttonRef = useRef(null);
    if(room && buttonRef.current) buttonRef.current.classList.add("hidden");

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
        })
        
    }
    return <button ref={buttonRef} className='restart-button' onClick={restartGame}>Play again</button> 
}
