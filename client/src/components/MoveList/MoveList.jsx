import React, { useEffect, useRef } from 'react';

import "./MoveList.css";
import Move from '../Move/Move';
import RestartButton from '../RestartButton/RestartButton';
import ResignButton from '../ResignButton/ResignButton';
import DrawButton from '../DrawButton/DrawButton';
export default function MoveList({moveList, chessboard, room, setMoveList, setChessboard, setGameOver, setTurn, onlineTeam, setResign}) {
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
        <RestartButton setMoveList={setMoveList} setChessboard={setChessboard} setGameOver={setGameOver} setTurn={setTurn} room={room}/>
        {room && 
          <>
            <div className='online-buttons'>
              <ResignButton setResign={setResign}/>
              <DrawButton/>
            </div>
            <div className='room'>{room}</div>
          </>
        }
      </div>
    </div>
  )
}
