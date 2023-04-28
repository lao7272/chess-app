import React from 'react';
import "./Tile.css";

export default function ({number, image}) {
    if(number % 2 === 0) {
        return (
            <div className='Tile black-tile'>
                {image && <div className='chess-piece' style={{backgroundImage: `url(${image})`}} ></div>}
            </div>
        )
    } else {
        return (
            <div className='Tile white-tile'>
                {image && <div className='chess-piece' style={{backgroundImage: `url(${image})`}}></div>}
            </div>
        )
    }
    

}
