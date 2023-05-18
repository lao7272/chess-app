import React, { useState } from 'react'
import { VERTICAL_AXIS, HORIZONTAL_AXIS } from '../../Constants';
export default function Move({pieces, moveIndex} ) {
    return (
        <div className='move'>
            <div> {moveIndex}- </div>
            {
                pieces.map((piece, i) => {
                    const pieceImage = piece.type === "pawn" || piece.castling ? "" : <img src={piece.image} alt={piece.type}/>;
                    const pieceTakes = piece.type === "pawn" ? `${HORIZONTAL_AXIS[piece.prevPosition.x]} x ` : " x ";
                    const castlingText = piece.prevPosition.x - piece.position.x === -2 ? "O-O" : "O-O-O"; 
                    const moveText = `${piece.take ? pieceTakes : ""}${HORIZONTAL_AXIS[piece.position.x]} ${VERTICAL_AXIS[piece.position.y]}`
                    return (
                        <div key={crypto.randomUUID()} className='move-items'>{pieceImage} {piece.castling ? castlingText : moveText} </div>
                        )
                })
            }
        </div>
    )
}