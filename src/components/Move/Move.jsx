import React from 'react'
import { VERTICAL_AXIS, HORIZONTAL_AXIS } from '../../Constants';
export default function Move({pieces, moveIndex} ) {
    return (
        <div className='move'>
            <div> {moveIndex}- </div>
            {
                pieces.map((piece, i) => {
                    const pieceImage = piece.type === "pawn" ? "" : <img src={piece.image} alt={piece.type}/>;
                    return <div key={crypto.randomUUID()}>{pieceImage} {HORIZONTAL_AXIS[piece.position.x]} {VERTICAL_AXIS[piece.position.y]}</div>
                })
            }
        </div>
    )
}
