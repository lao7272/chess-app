import React, { useRef } from 'react';
import "./GameOverAlert.css";

export default function GameOver({gameOver, resign}) {
    const alertRef = useRef(null);
    const isDraw = gameOver === 'draw' ? <span>{gameOver}</span> : <span>{gameOver} team won</span>;
    const teamResigned = gameOver === "white" ?  "black" : "white";
    if(gameOver) alertRef.current.classList.remove("hidden");
    function closeAlert() {
        alertRef.current.classList.add("hidden");
    }
    return (
        <div ref={alertRef} className='checkmate-card-container hidden'>

            <div  className='checkmate-card'>
                <button onClick={e => closeAlert()} className='checkmate-close-alert'>&times;</button>
                <div className='checkmate-card-body'>
                    {isDraw}
                    {resign && <p>{teamResigned} Team Resigned</p>}
                </div>
            </div>
        </div>
    )
}
