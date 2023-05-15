import React from 'react';
import "./PromotionAlert.css";
export default function promotionAlert({promoteRef, setPromotionTeam, promotePawn}) {
    return (
        <div className='card hidden' ref={promoteRef}>
                <div className='card-body'>
                    <div onClick={() => promotePawn("queen")} className='piece-promotion-option'><img src={`../assets/images/${setPromotionTeam()}-queen.png`} alt="Queen" /></div>
                    <div onClick={() => promotePawn("knight")} className='piece-promotion-option'><img src={`../assets/images/${setPromotionTeam()}-knight.png`} alt="Knight" /></div>
                    <div onClick={() => promotePawn("bishop")} className='piece-promotion-option'><img src={`../assets/images/${setPromotionTeam()}-bishop.png`} alt="Bishop" /></div>
                    <div onClick={() => promotePawn("rook")} className='piece-promotion-option'><img src={`../assets/images/${setPromotionTeam()}-rook.png`} alt="Rook" /></div>
                </div>
        </div>
    )
}
