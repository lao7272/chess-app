import React from 'react';
import "./Square.css";

export default function Square ({number, image, highlight, selected, moveToSquare, team, turn}) {
    const className = [
        'square', 
        number % 2 === 0 && "black-square", 
        number % 2 !== 0 && "white-square", 
        highlight && "highlighted-square",
        selected && "highlighted-bg",
        image && "chess-piece-square", 
        

    ].filter(Boolean).join(' ');
    return (
        <div className={className} 
        onClick={(e) =>  highlight && moveToSquare(e, false)}
        >
            {image && <div className={`chess-piece ${team} ${turn === team ?  "grab-piece" : ""}`} style={{backgroundImage: `url(${image})`}} ></div>}
        </div>
    )    

} 
