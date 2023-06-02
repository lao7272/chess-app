import React, { useEffect, useRef } from 'react';
import "./GameOverAlert.css";

export default function GameOver({gameOver, resign}) {
    const alertRef = useRef(null);
    const teamResigned = gameOver === "white" ?  "Black Team Resigned" : "White Team Resigned";
    const gameOverInfo = resign ? <p>{teamResigned}</p> : <p>Checkmate!</p>
    const isDraw = gameOver === 'draw' ? <span>{gameOver}</span> : <><span>{gameOver} team won</span> {gameOverInfo}</>;
    useEffect(() => {
        if(!gameOver) return;
        alertRef.current.classList.remove("hidden");
    }, [gameOver]) 
    function closeAlert() {
        alertRef.current.classList.add("hidden");
    }
    return (
        <div ref={alertRef} className='checkmate-card-container hidden'>

            <div  className='checkmate-card'>
                <button onClick={e => closeAlert()} className='checkmate-close-alert'>&times;</button>
                <div className='checkmate-card-body'>
                    {isDraw}
                </div>
            </div>
        </div>
    )
}
