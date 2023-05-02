import {samePosition} from "../Constants";
import {
    pawnLogic,
    kingLogic,
    queenLogic,
    knightLogic,
    bishopLogic,
    rookLogic,
    getPossiblePawnMoves,
    getPossibleKnightMoves,
    getPossibleBishopMoves,
    getPossibleRookMoves,
    getPossibleQueenMoves,
    getPossibleKingMoves
} from "./rules";


export default class Referee {
    isEnPassantCapture(initialPosition, currentPosition, boardState, team, type) {
        const pawnDirection = team === 'white' ? 1 : -1;
        if (type === 'PAWN') {
            if ((currentPosition.x - initialPosition.x === -1 || currentPosition.x - initialPosition.x === 1) && currentPosition.y - initialPosition.y === pawnDirection) {
                const piece = boardState.find(p => samePosition(p.position, {
                    x: currentPosition.x,
                    y: currentPosition.y - pawnDirection
                }) && p.enPassant === true);
                if (piece) return true;
            }
        }
        return false;
    }
    isValidMove(initialPosition, currentPosition, boardState, team, type) {
        switch (type) {
            case 'PAWN':
                return pawnLogic(initialPosition, currentPosition, boardState, team);
            case 'KNIGHT':
                return knightLogic(initialPosition, currentPosition, boardState, team);
            case 'BISHOP':
                return bishopLogic(initialPosition, currentPosition, boardState, team);
            case 'ROOK':
                return rookLogic(initialPosition, currentPosition, boardState, team);
            case 'QUEEN':
                return queenLogic(initialPosition, currentPosition, boardState, team);
            case 'KING':
                return kingLogic(initialPosition, currentPosition, boardState, team);
            default:
                return false;
        }
    }
    getValidMoves(piece, boardState) {
        switch (piece.type) {
            case 'PAWN':
                return getPossiblePawnMoves(piece, boardState);
            case 'KNIGHT':
                return getPossibleKnightMoves(piece, boardState);
            case 'BISHOP':
                return getPossibleBishopMoves(piece, boardState);
            case 'ROOK':
                return getPossibleRookMoves(piece, boardState);
            case 'QUEEN':
                return getPossibleQueenMoves(piece, boardState);
            case 'KING':
                return getPossibleKingMoves(piece, boardState);
            default:
                return [];
        }
    }
}