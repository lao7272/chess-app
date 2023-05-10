import React, { useEffect, useRef, useState } from 'react';
import ChessBoard from '../Chessboard/Chessboard'
import { initialChessboard } from '../../Constants';
import { Piece } from '../../models';

export default function Referee() {
    const [chessboard, setChessboard] = useState(initialChessboard);
    const [pawnPromotion, setpawnPromotion] = useState();

    const promoteRef = useRef(null);

    useEffect(() => {
        chessboard.getPossibleMoves();
    }, []);

    const playMove = (currentPiece, desiredPosition) => {
        if (currentPiece.team === "white" && chessboard.totalTurns % 2 !== 1) return false;
        if (currentPiece.team === "black" && chessboard.totalTurns % 2 !== 0) return false;
        const validMove = currentPiece.possibleMoves.some(move => move.samePosition(desiredPosition));
        if (!validMove) return false;
        const isEnPassant = isEnPassantCapture(currentPiece.position, desiredPosition, currentPiece.team, currentPiece.type);

        // playmove modifies the board, therefore, the chessboard is updated
        setChessboard(() => {
            const clonedChessboard = chessboard.clone();
            clonedChessboard.totalTurns++;
            // MOVE LOGIC
            clonedChessboard.playMove(currentPiece, desiredPosition, isEnPassant, validMove); 
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
    const isEnPassantCapture = (initialPosition, currentPosition, team, type) => {
        const pawnDirection = team === 'white' ? 1 : -1;
        if (type === 'pawn') {
            if ((currentPosition.x - initialPosition.x === -1 || currentPosition.x - initialPosition.x === 1) && currentPosition.y - initialPosition.y === pawnDirection) {
                const piece = chessboard.pieces.find(p => p.samePosition({
                    x: currentPosition.x,
                    y: currentPosition.y - pawnDirection
                }) && p.isPawn && p.enPassant);
                if (piece) return true;
            }
        }
        return false;
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
    return (
        <>
            <div style={{color: "white", display:"flex", margin: "10px 10px 10px 0px", fontSize: "24px"}}>
                Total Moves:<div style={{marginLeft: "10px"}}> {chessboard.totalTurns}</div>
            </div>
            <div className='pawn-promotion-container hidden' ref={promoteRef}>
                <div className='pawn-promotion-body'>
                    <div onClick={() => promotePawn("queen")} className='piece-promotion-option'><img src={`../assets/images/${setPromotionTeam()}-queen.png`} alt="Queen" /></div>
                    <div onClick={() => promotePawn("knight")} className='piece-promotion-option'><img src={`../assets/images/${setPromotionTeam()}-knight.png`} alt="Knight" /></div>
                    <div onClick={() => promotePawn("bishop")} className='piece-promotion-option'><img src={`../assets/images/${setPromotionTeam()}-bishop.png`} alt="Bishop" /></div>
                    <div onClick={() => promotePawn("rook")} className='piece-promotion-option'><img src={`../assets/images/${setPromotionTeam()}-rook.png`} alt="Rook" /></div>
                </div>
            </div>
            <ChessBoard playMove={playMove} pieces={chessboard.pieces} />
        </>
    )
}
