import React, { useEffect, useRef, useState } from 'react';
import ChessBoard from '../Chessboard/Chessboard'
import { initialChessboard } from '../../Constants';
import {
    bishopLogic,
    kingLogic,
    knightLogic,
    pawnLogic,
    queenLogic,
    rookLogic
} from '../../referee/rules';
import { Piece } from '../../models';

export default function Referee() {
    const [chessboard, setChessboard] = useState(initialChessboard);
    const [pawnPromotion, setpawnPromotion] = useState();

    const promoteRef = useRef(null);


    useEffect(() => {
        updatePossibleMoves();
    }, []);
    const updatePossibleMoves = () => {
        chessboard.getPossibleMoves();
    }

    const playMove = (currentPiece, desiredPosition) => {
        const possibleMoves = chessboard.getValidMoves(currentPiece);
        if (!possibleMoves) return false;
        const validMove = currentPiece.possibleMoves.some(move => move.samePosition(desiredPosition));
        if (!validMove) return false;
        const isEnPassant = isEnPassantCapture(currentPiece.position, desiredPosition, currentPiece.team, currentPiece.type);

        // playmove modifies the board, therefore, the chessboard is updated
        setChessboard((prevChessboard) => {
            // MOVE LOGIC
            chessboard.playMove(currentPiece, desiredPosition, isEnPassant, validMove); 
            return chessboard.clone();
        });
        // PAWN PROMOTION
        const promotion = currentPiece.team === "white" ? 7 : 0;

        if (desiredPosition.y === promotion && currentPiece.isPawn) {
            promoteRef.current.classList.remove("hidden");
            setpawnPromotion(prevPromotionPawn => {
                const clonedCurrentPiece = currentPiece.clone()
                clonedCurrentPiece.position = desiredPosition.clone();
                return prevPromotionPawn =  clonedCurrentPiece.clone();
            });
        }
    }
    const isValidMove = (initialPosition, currentPosition, team, type) => {
        switch (type) {
            case 'pawn':
                return pawnLogic(initialPosition, currentPosition, chessboard.pieces, team);
            case 'knight':
                return knightLogic(initialPosition, currentPosition, chessboard.pieces, team);
            case 'bishop':
                return bishopLogic(initialPosition, currentPosition, chessboard.pieces, team);
            case 'rook':
                return rookLogic(initialPosition, currentPosition, chessboard.pieces, team);
            case 'queen':
                return queenLogic(initialPosition, currentPosition, chessboard.pieces, team);
            case 'king':
                return kingLogic(initialPosition, currentPosition, chessboard.pieces, team);
            default:
                return false;
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
        setChessboard((prevChessboard) => {
            const clonedChessboard = chessboard.clone();
            clonedChessboard.pieces = clonedChessboard.pieces.reduce((result, piece) => {
                if (piece.samePosition(pawnPromotion.position)) { 
                    result.push(new Piece(piece.position.clone(), piece.team, type));
                } else {
                    result.push(piece);
                }
                return result;
            }, []);
            clonedChessboard.getPossibleMoves()

            return clonedChessboard;
        });
        updatePossibleMoves();
    }

    const setPromotionTeam = () => {
        if (!pawnPromotion) return "white";
        return pawnPromotion.team === "white" ? "white" : "black";
    }
    return (
        <>
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
