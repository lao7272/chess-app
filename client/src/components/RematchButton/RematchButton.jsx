import React from 'react';
import './RematchButton.css'

export default function RematchButton({setRematch}) {
    return (
        <button className='rematch' onClick={() => setRematch(true)}> Rematch </button>
    )
}
