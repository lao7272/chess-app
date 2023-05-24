import React, { useEffect, useRef } from 'react';

import "./MoveList.css";
import Move from '../Move/Move';
export default function MoveList({moveList, chessboard, room}) {
  const moveListRef = useRef(null);

  useEffect(() => {
    if (moveListRef && moveListRef.current.lastChild) {
      moveListRef.current.lastChild.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chessboard]);
  return (
    <div className='move-list'>
      <div className='move-list-header'>
        <h3>Moves</h3>
      </div>
      <div ref={moveListRef} className='move-list-body'>
        {
          moveList.map((pieces, i) => {
            return <Move key={crypto.randomUUID()} pieces={pieces} moveIndex={i+1}/>
          })
        }
      </div>
      <div className="move-list-footer">
        {room && <div className='room'><b>Room id:</b> {room}</div>}
      </div>
    </div>
  )
}
