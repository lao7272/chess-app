import React from 'react';
import "./Square.css";

export default function Square ({number, image, highlight}) {
    const className = [
        'square', 
        number % 2 === 0 && "black-square", 
        number % 2 !== 0 && "white-square", 
        highlight && "highlighted-square",
        image && "chess-piece-square"
    ].filter(Boolean).join(' ');
    return (
        <div className={className}>
            {image && <div className='chess-piece' style={{backgroundImage: `url(${image})`}} ></div>}
        </div>
    )    

} 
