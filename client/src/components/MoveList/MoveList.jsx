import React, { useEffect, useRef } from 'react';

import "./MoveList.css";
import Move from '../Move/Move';
import RestartButton from '../RestartButton/RestartButton';
import ResignButton from '../ResignButton/ResignButton';
import DrawButton from '../DrawButton/DrawButton';
import DrawOfferAlert from '../DrawOfferAlert/DrawOfferAlert.jsx';
import RematchButton from '../RematchButton/RematchButton';
import RematchAlert from '../RematchAlert/RematchAlert';
export default function MoveList({ 
  moveList, 
  chessboard, 
  room, 
  setMoveList, 
  setChessboard, 
  setGameOver, 
  setTurn, 
  setResign, 
  setDrawOffer, 
  setDrawOfferReq, 
  drawOfferReq, 
  setDrawOfferRes, 
  gameOver, 
  setRematch, 
  setRematchReq, 
  rematchReq, 
  setRematchRes 
}) {
  const moveListRef = useRef(null);

  useEffect(() => {
    if (moveListRef && moveListRef.current.lastChild) {
      moveListRef.current.lastChild.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chessboard, gameOver]);
  return (
    <div className='move-list'>
      <div className='move-list-header'>
        <h3>Moves</h3>
      </div>
      <div ref={moveListRef} className='move-list-body'>
        {
          moveList.map((pieces, i) => {
            return <Move key={crypto.randomUUID()} pieces={pieces} moveIndex={i + 1} />
          })
        }
      </div>
      {rematchReq && <RematchAlert setRematchReq={setRematchReq} setRematchRes={setRematchRes}/>}
      {drawOfferReq && <DrawOfferAlert setDrawOfferReq={setDrawOfferReq} setDrawOfferRes={setDrawOfferRes} drawOfferReq={drawOfferReq}/>}
      <div className="move-list-footer">
        <RestartButton setMoveList={setMoveList} setChessboard={setChessboard} setGameOver={setGameOver} setTurn={setTurn} room={room} />
        {
          room && 
          <div className="move-list-footer-online">
            {!gameOver && room && <div className='online-buttons'>
              <ResignButton setResign={setResign} />
              <DrawButton setDrawOffer={setDrawOffer}/>
            </div>}
            {gameOver && <RematchButton setRematch={setRematch}/>}
            <div className='room'>{room}</div>
          </div>
        }
      </div>
    </div>
  )
}
