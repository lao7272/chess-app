import React, { useEffect, useRef, useState } from 'react';
import ChessBoard from '../Chessboard/Chessboard'
import { INITIAL_CHESSBOARD_STATE } from '../../Constants';
import {
    bishopLogic,
    getPossibleBishopMoves,
    getPossibleKingMoves,
    getPossibleKnightMoves,
    getPossiblePawnMoves,
    getPossibleQueenMoves,
    getPossibleRookMoves,
    kingLogic,
    knightLogic,
    pawnLogic,
    queenLogic,
    rookLogic
} from '../../referee/rules';
import { Position } from '../../models';

export default function Referee() {
    const [pieces, setPieces] = useState(INITIAL_CHESSBOARD_STATE);
    const [pawnPromotion, setpawnPromotion] = useState();
    
    const promoteRef = useRef(null);


    useEffect(()=> {
        updatePossibleMoves();
    },[])
    const updatePossibleMoves = () => {
        setPieces((pieces) => {
            return pieces.map(p => {
                p.possibleMoves = getValidMoves(p);
                return p;
            })
        })
    }
    const playMove = (grabPosition, desiredPosition, currentPiece) => {
        const { x, y } = desiredPosition;
        const { team, type } = currentPiece;
        const validMove = isValidMove(grabPosition, desiredPosition, team, type);
        const isEnPassant = isEnPassantCapture(grabPosition, desiredPosition, team, type);

        const pawnDirection = team === 'white' ? 1 : -1;
        if (isEnPassant) {
            const updatedPieces = pieces.reduce((result, piece) => {
                if (piece.samePosition(grabPosition)) {
                    if (piece.isPawn) piece.enPassant = false;
                    piece.position.x = x;
                    piece.position.y = y;
                    result.push(piece);
                } else if (!piece.samePosition(new Position(x, y - pawnDirection))) {
                    if (piece.isPawn) piece.enPassant = false;
                    result.push(piece);
                }
                return result
            }, []);
            updatePossibleMoves();
            setPieces(updatedPieces);
        } else if (validMove) {
            // UPDATES THE PIECE POSITION AND CAPTURES
            const updatedPieces = pieces.reduce((result, piece) => {
                if (piece.samePosition(grabPosition)) {
                    // Special pawn move
                    if (piece.isPawn) piece.enPassant = Math.abs(grabPosition.y - y) === 2;
                    piece.position.x = x;
                    piece.position.y = y;
                    const promotion = piece.team === "white" ? 7 : 0;
                    if (y === promotion && piece.isPawn) {
                        promoteRef.current.classList.remove("hidden");
                        setpawnPromotion(piece);
                    }
                    result.push(piece);
                } else if (!piece.samePosition(new Position(x, y))) {
                    if (piece.isPawn) piece.enPassant = false;
                    result.push(piece);
                }
                return result
            }, []);
            updatePossibleMoves();  
            setPieces(updatedPieces);
        } else {
            return false;
        }
        return true;
    }
    const isValidMove = (initialPosition, currentPosition, team, type) => {
        switch (type) {
            case 'pawn':
                return pawnLogic(initialPosition, currentPosition, pieces, team);
            case 'knight':
                return knightLogic(initialPosition, currentPosition, pieces, team);
            case 'bishop':
                return bishopLogic(initialPosition, currentPosition, pieces, team);
            case 'rook':
                return rookLogic(initialPosition, currentPosition, pieces, team);
            case 'queen':
                return queenLogic(initialPosition, currentPosition, pieces, team);
            case 'king':
                return kingLogic(initialPosition, currentPosition, pieces, team);
            default:
                return false;
        }
    }
    const getValidMoves = (piece) => {
        switch (piece.type) {
            case 'pawn':
                return getPossiblePawnMoves(piece, pieces);
            case 'knight':
                return getPossibleKnightMoves(piece, pieces);
            case 'bishop':
                return getPossibleBishopMoves(piece, pieces);
            case 'rook':
                return getPossibleRookMoves(piece, pieces);
            case 'queen':
                return getPossibleQueenMoves(piece, pieces);
            case 'king':
                return getPossibleKingMoves(piece, pieces);
            default:
                return [];
        }
    }
    const isEnPassantCapture = (initialPosition, currentPosition, team, type) => {
        const pawnDirection = team === 'white' ? 1 : -1;
        if (type === 'pawn') {
            if ((currentPosition.x - initialPosition.x === -1 || currentPosition.x - initialPosition.x === 1) && currentPosition.y - initialPosition.y === pawnDirection) {
                const piece = pieces.find(p => p.samePosition({
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
        let imageType = '';
        switch (type) {
            case 'queen':
                imageType = 'queen';
                break;
            case 'knight':
                imageType = 'knight';
                break;
            case 'rook':
                imageType = 'rook';
                break;
            case 'bishop':
                imageType = 'bishop';
                break;
            default:
                imageType = '';
        }
        const imageTeam = pawnPromotion.team === "white" ? "white" : "black";
        promoteRef.current.classList.add('hidden');
        const updatedPieces = pieces.reduce((result, piece) => {
            if (piece.samePosition(pawnPromotion.position)) {
                piece.type = type;
                piece.image = `./assets/images/${imageTeam}-${imageType}.png`;
            }
            result.push(piece);
            return result;
        }, []);
        updatePossibleMoves();
        setPieces(updatedPieces);
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
            <ChessBoard playMove={playMove} pieces={pieces} />
        </>
    )
}
