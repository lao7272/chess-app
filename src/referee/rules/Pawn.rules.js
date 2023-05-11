import { Position } from "../../models";
import { tileIsOccupied, pieceIsCaptured } from "./General.rules";
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
export default getPossiblePawnMoves;