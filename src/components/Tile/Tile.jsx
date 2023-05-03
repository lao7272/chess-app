import React from 'react';
import "./Tile.css";

export default function ({number, image, highlight}) {
    const className = [
        'tile', 
        number % 2 === 0 && "black-tile", 
        number % 2 !== 0 && "white-tile", 
        highlight && "highlighted-tile",
        image && "chess-piece-tile"
    ].filter(Boolean).join(' ');
    return (
        <div className={className}>
            {image && <div className='chess-piece' style={{backgroundImage: `url(${image})`}} ></div>}
        </div>
    )    

} 
