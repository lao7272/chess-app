import React from 'react';

import "./MoveList.css";
import Move from '../Move/Move';
export default function MoveList({moveList}) {
  console.log(moveList)
  return (
    <div className='move-list'>
      <div className='move-list-header'>
        <h3>Moves</h3>
      </div>
      <div className='.move-list-body'>
        {
          moveList.map((pieces, i) => {
            return <Move key={crypto.randomUUID()} pieces={pieces} moveIndex={i+1}/>
          })
        }
      </div>
    </div>
  )
}
