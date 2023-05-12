import React, { useRef, useState } from 'react';
import ChessBoard from '../Chessboard/Chessboard';
import { initialChessboard } from '../../Constants';
import { Piece } from '../../models';
import './Referee.css';

export default function Referee() {
    const [chessboard, setChessboard] = useState(initialChessboard.clone());
    const [pawnPromotion, setpawnPromotion] = useState();

    const promoteRef = useRef(null);
    const checkmateRef = useRef(null);

    const playMove = (currentPiece, desiredPosition) => {
        if (currentPiece.team === "white" && chessboard.totalTurns % 2 !== 1) return false;
        if (currentPiece.team === "black" && chessboard.totalTurns % 2 !== 0) return false;
        const validMove = currentPiece.possibleMoves.some(move => move.samePosition(desiredPosition));
        if (!validMove) return false;

        // Playmove modifies the board, therefore, the chessboard is updated
        setChessboard(() => {
            const clonedChessboard = chessboard.clone();
            clonedChessboard.totalTurns++;
            // MOVE LOGIC
            clonedChessboard.playMove(currentPiece, desiredPosition, validMove); 
            if (clonedChessboard.winningTeam) {
                checkmateRef.current.classList.remove("hidden");
            }
            return clonedChessboard;
        });
        // PAWN PROMOTION
        const promotion = currentPiece.team === "white" ? 7 : 0;

        if (desiredPosition.y === promotion && currentPiece.isPawn) {
            promoteRef.current.classList.remove("hidden");
            setpawnPromotion(prevPromotionPawn => {
                const clonedCurrentPiece = currentPiece.clone()
                clonedCurrentPiece.position = desiredPosition.clone();
                return prevPromotionPawn =  clonedCurrentPiece;
            });
        }
    }    
    const promotePawn = (type) => {
        if (!pawnPromotion) return;
        promoteRef.current.classList.add('hidden');
        setChessboard(() => {
            const clonedChessboard = chessboard.clone();
            clonedChessboard.pieces = clonedChessboard.pieces.reduce((result, piece) => {
                if (piece.samePosition(pawnPromotion.position)) { 
                    result.push(new Piece(piece.position.clone(), piece.team, type, true));
                } else {
                    result.push(piece);
                }
                return result;
            }, []);
            clonedChessboard.getPossibleMoves()

            return clonedChessboard;
        });
        chessboard.getPossibleMoves();
    }

    const setPromotionTeam = () => {
        if (!pawnPromotion) return "white";
        return pawnPromotion.team === "white" ? "white" : "black";
    }
    const restartGame = () => {
        checkmateRef.current.classList.add("hidden");
        setChessboard(initialChessboard.clone());
    }
    return (
        <>
            <div style={{color: "white", display:"flex", margin: "10px 10px 10px 0px", fontSize: "24px"}}>
                Total Moves:<div style={{marginLeft: "10px"}}> {chessboard.totalTurns}</div>
            </div>
            <div className='card hidden' ref={promoteRef}>
                <div className='card-body'>
                    <div onClick={() => promotePawn("queen")} className='piece-promotion-option'><img src={`../assets/images/${setPromotionTeam()}-queen.png`} alt="Queen" /></div>
                    <div onClick={() => promotePawn("knight")} className='piece-promotion-option'><img src={`../assets/images/${setPromotionTeam()}-knight.png`} alt="Knight" /></div>
                    <div onClick={() => promotePawn("bishop")} className='piece-promotion-option'><img src={`../assets/images/${setPromotionTeam()}-bishop.png`} alt="Bishop" /></div>
                    <div onClick={() => promotePawn("rook")} className='piece-promotion-option'><img src={`../assets/images/${setPromotionTeam()}-rook.png`} alt="Rook" /></div>
                </div>
            </div>
            <div className='card hidden' ref={checkmateRef}>
                <div className='card-body'>
                    <div className='checkmate-body'>
                        <span>{chessboard.winningTeam} team won</span>
                        <button onClick={restartGame}>Play again</button>
                    </div>
                </div>
            </div>
            <div className='chessboard-container'>
                <div className='number-index'></div>
                <ChessBoard playMove={playMove} pieces={chessboard.pieces}/>
                <div className='letter-index'></div>
            </div>
        </>
    )
}
