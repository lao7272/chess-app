import React, { useEffect, useRef, useState } from 'react';
import ChessBoard from '../Chessboard/Chessboard'
import { INITIAL_CHESSBOARD_STATE, samePosition } from '../../Constants';
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
                if (samePosition(piece.position, grabPosition)) {
                    piece.enPassant = false;
                    piece.position.x = x;
                    piece.position.y = y;
                    result.push(piece);
                } else if (!samePosition(piece.position, { x, y: y - pawnDirection })) {
                    if (piece.type === "PAWN") {
                        piece.enPassant = false;
                    }
                    result.push(piece);
                }
                return result
            }, []);
            updatePossibleMoves();
            setPieces(updatedPieces);
        } else if (validMove) {
            // UPDATES THE PIECE POSITION AND CAPTURES
            const updatedPieces = pieces.reduce((result, piece) => {
                if (samePosition(piece.position, grabPosition)) {
                    // Special pawn move
                    piece.enPassant = Math.abs(grabPosition.y - y) === 2 && piece.type === 'PAWN';

                    piece.position.x = x;
                    piece.position.y = y;
                    const promotion = piece.team === "white" ? 7 : 0;
                    if (y === promotion && piece.type === "PAWN") {
                        promoteRef.current.classList.remove("hidden");
                        setpawnPromotion(piece);
                    }
                    result.push(piece);
                } else if (!samePosition(piece.position, { x, y })) {
                    if (piece.type === "PAWN") {
                        piece.enPassant = false;
                    }
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
            case 'PAWN':
                return pawnLogic(initialPosition, currentPosition, pieces, team);
            case 'KNIGHT':
                return knightLogic(initialPosition, currentPosition, pieces, team);
            case 'BISHOP':
                return bishopLogic(initialPosition, currentPosition, pieces, team);
            case 'ROOK':
                return rookLogic(initialPosition, currentPosition, pieces, team);
            case 'QUEEN':
                return queenLogic(initialPosition, currentPosition, pieces, team);
            case 'KING':
                return kingLogic(initialPosition, currentPosition, pieces, team);
            default:
                return false;
        }
    }
    const getValidMoves = (piece) => {
        switch (piece.type) {
            case 'PAWN':
                return getPossiblePawnMoves(piece, pieces);
            case 'KNIGHT':
                return getPossibleKnightMoves(piece, pieces);
            case 'BISHOP':
                return getPossibleBishopMoves(piece, pieces);
            case 'ROOK':
                return getPossibleRookMoves(piece, pieces);
            case 'QUEEN':
                return getPossibleQueenMoves(piece, pieces);
            case 'KING':
                return getPossibleKingMoves(piece, pieces);
            default:
                return [];
        }
    }
    const isEnPassantCapture = (initialPosition, currentPosition, team, type) => {
        const pawnDirection = team === 'white' ? 1 : -1;
        if (type === 'PAWN') {
            if ((currentPosition.x - initialPosition.x === -1 || currentPosition.x - initialPosition.x === 1) && currentPosition.y - initialPosition.y === pawnDirection) {
                const piece = pieces.find(p => samePosition(p.position, {
                    x: currentPosition.x,
                    y: currentPosition.y - pawnDirection
                }) && p.enPassant === true);
                if (piece) return true;
            }
        }
        return false;
    }
    const promotePawn = (type) => {
        if (!pawnPromotion) return;
        let imageType = '';
        switch (type) {
            case 'QUEEN':
                imageType = 'queen';
                break;
            case 'KNIGHT':
                imageType = 'knight';
                break;
            case 'ROOK':
                imageType = 'rook';
                break;
            case 'BISHOP':
                imageType = 'bishop';
                break;
            default:
                imageType = '';
        }
        const imageTeam = pawnPromotion.team === "white" ? "white" : "black";
        promoteRef.current.classList.add('hidden');
        const updatedPieces = pieces.reduce((result, piece) => {
            if (samePosition(pawnPromotion.position, piece.position)) {
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
                    <div onClick={() => promotePawn("QUEEN")} className='piece-promotion-option'><img src={`../assets/images/${setPromotionTeam()}-queen.png`} alt="Queen" /></div>
                    <div onClick={() => promotePawn("KNIGHT")} className='piece-promotion-option'><img src={`../assets/images/${setPromotionTeam()}-knight.png`} alt="Knight" /></div>
                    <div onClick={() => promotePawn("BISHOP")} className='piece-promotion-option'><img src={`../assets/images/${setPromotionTeam()}-bishop.png`} alt="Bishop" /></div>
                    <div onClick={() => promotePawn("ROOK")} className='piece-promotion-option'><img src={`../assets/images/${setPromotionTeam()}-rook.png`} alt="Rook" /></div>
                </div>
            </div>
            <ChessBoard playMove={playMove} pieces={pieces} />
        </>
    )
}
