import React from 'react'
import { VERTICAL_AXIS, HORIZONTAL_AXIS } from '../../Constants';
import './Move.css'
export default function Move({pieces, moveIndex} ) {
    return (
        <div className='move'>
            <div className='move-index'> {moveIndex}: </div>
            {
                pieces.map(piece => {
                    const pieceImage = piece.type === "pawn" || piece.castling || piece.promotion ? "" : <img src={piece.image} alt={piece.type}/>;
                    const pieceTakes = piece.type === "pawn" ? `${HORIZONTAL_AXIS[piece.prevPosition.x]} x ` : " x ";
                    const castlingText = piece.prevPosition.x - piece.position.x === -2 ? "O-O" : "O-O-O"; 
                    const promotion = piece.promotion ? <>
                        {pieceTakes ? <>{HORIZONTAL_AXIS[piece.prevPosition.x]} {VERTICAL_AXIS[piece.prevPosition.y]} x </> : ""}{HORIZONTAL_AXIS[piece.position.x]} {VERTICAL_AXIS[piece.position.y]} = <img src={piece.image} alt={piece.type}/> {piece.check && "+"}
                    </> 
                    : false;
                    const moveText = `${piece.take ? pieceTakes : ""}${HORIZONTAL_AXIS[piece.position.x]} ${VERTICAL_AXIS[piece.position.y]}`
                    const gameOver = piece.gameOverSymbol ? piece.gameOverSymbol : false;
                    if(gameOver) {
                        return <div key={crypto.randomUUID()} className='move-items'>{gameOver}</div>
                    } else if(promotion) {
                        return (
                            <div key={crypto.randomUUID()} className='move-items'>
                                {promotion}
                            </div>
                        )
                    } else {
                        return (
                                <div key={crypto.randomUUID()} className='move-items'>
                                    {pieceImage} 
                                    <div className='move-items-txt'>{piece.castling ? castlingText : moveText}{piece.check && "+"} </div>
                                </div>
                            )
                    }
                })
            }
        </div>
    )
}
