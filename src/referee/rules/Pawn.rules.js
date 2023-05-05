import { Position } from "../../models";
import { tileIsOccupied, pieceIsCaptured, tileIsEmptyOrCaptured } from "./General.rules";
const pawnLogic = (initialPosition, currentPosition, boardState, team) => {
    const specialRow = team === 'white' ? 1 : 6;
    const pawnDirection = team === 'white' ? 1 : -1;

    if (initialPosition.x === currentPosition.x && initialPosition.y === specialRow && currentPosition.y - initialPosition.y === 2 * pawnDirection) {
        if (!tileIsOccupied(currentPosition, boardState) && !tileIsOccupied({
                x: currentPosition.x,
                y: currentPosition.y - pawnDirection
            }, boardState)) return true;
    } else if (initialPosition.x === currentPosition.x && currentPosition.y - initialPosition.y === pawnDirection) {
        if (!tileIsOccupied(currentPosition, boardState)) return true;
    }
    // CAPTURE A PIECE
    else if (currentPosition.x - initialPosition.x === -1 && currentPosition.y - initialPosition.y === pawnDirection) {
        //CAPTURE IN UPPER OR BOTTOM LEFT CORNER
        if (pieceIsCaptured(currentPosition, boardState, team)) return true;
    } else if (currentPosition.x - initialPosition.x === 1 && currentPosition.y - initialPosition.y === pawnDirection) {
        //CAPTURE IN UPPER OR BOTTOM RIGHT CORNER
        if (pieceIsCaptured(currentPosition, boardState, team)) return true;
    }
    return false;
}
const getPossiblePawnMoves = (pawn, boardState) => {
    const possibleMoves = [];
    const pawnDirection = pawn.team === 'white' ? 1 : -1;
    const specialRow = pawn.team === 'white' ? 1 : 6;
    const normalMove = new Position(pawn.position.x, pawn.position.y + pawnDirection );
    const specialMove = new Position(pawn.position.x, pawn.position.y + pawnDirection * 2 );
    const rightCaptureMove = new Position(pawn.position.x + 1, pawn.position.y + pawnDirection);
    const leftCaptureMove = new Position(pawn.position.x - 1, pawn.position.y + pawnDirection );
    const leftPosition = new Position(pawn.position.x - 1, pawn.position.y)
    const rightPosition = new Position(pawn.position.x + 1, pawn.position.y)

    if(!tileIsOccupied(normalMove, boardState)) possibleMoves.push(normalMove);
    
    if(pawn.position.y === specialRow && !tileIsOccupied(specialMove, boardState)){
        possibleMoves.push(specialMove); 
    } 
    // CAPTURE
    if (pieceIsCaptured(rightCaptureMove, boardState, pawn.team)) {
        possibleMoves.push(rightCaptureMove); 
    } // EN PASSANT
    else if (!tileIsOccupied(rightCaptureMove, boardState)) {
        const rightPiece = boardState.find(p => p.samePosition(rightPosition));
        if(rightPiece && rightPiece.enPassant) {
            possibleMoves.push(rightCaptureMove);
        }
    }
    // CAPTURE
    if (pieceIsCaptured(leftCaptureMove, boardState, pawn.team)) {
        possibleMoves.push(leftCaptureMove);
    } // EN PASSANT
    else if (!tileIsOccupied(leftCaptureMove, boardState)) {
        const leftPiece = boardState.find(p => p.samePosition(leftPosition));
        if(leftPiece && leftPiece.enPassant) {
            possibleMoves.push(leftCaptureMove);
        }
    }

    return possibleMoves;
}
export {
    pawnLogic,
    getPossiblePawnMoves
}