import Piece from "../Piece";
import Position from "../Positition";
import Movement from "./Movement";
const movement = new Movement();
export default class Pawn extends Piece {
    constructor (position, team, enPassant, possibleMoves = []) {
        super(position, team, "pawn", possibleMoves);
        this.enPassant = enPassant;
    }
    getPossibleMoves (pieces) {
        const pawnDirection = this.team === 'white' ? 1 : -1;
        const specialRow = this.team === 'white' ? 1 : 6;
        const normalMove = new Position(this.position.x, this.position.y + pawnDirection );
        const specialMove = new Position(this.position.x, this.position.y + pawnDirection * 2 );
        const rightCaptureMove = new Position(this.position.x + 1, this.position.y + pawnDirection);
        const leftCaptureMove = new Position(this.position.x - 1, this.position.y + pawnDirection );
        const leftPosition = new Position(this.position.x - 1, this.position.y);
        const rightPosition = new Position(this.position.x + 1, this.position.y);
    
        if(!movement.tileIsOccupied(normalMove, pieces)) this.possibleMoves.push(normalMove);
        
        if(this.position.y === specialRow && !movement.tileIsOccupied(specialMove, pieces) && !movement.tileIsOccupied(normalMove, pieces)){
            this.possibleMoves.push(specialMove); 
        } 
        // CAPTURE
        if (movement.pieceIsCaptured(rightCaptureMove, pieces, this.team)) {
            this.possibleMoves.push(rightCaptureMove); 
        } // EN PASSANT
        else if (!movement.tileIsOccupied(rightCaptureMove, pieces)) {
            const rightPiece = pieces.find(p => p.samePosition(rightPosition));
            if(rightPiece && rightPiece.enPassant) {
                this.possibleMoves.push(rightCaptureMove);
            }
        }
        // CAPTURE
        if (movement.pieceIsCaptured(leftCaptureMove, pieces, this.team)) {
            this.possibleMoves.push(leftCaptureMove);
        } // EN PASSANT
        else if (!movement.tileIsOccupied(leftCaptureMove, pieces)) {
            const leftPiece = pieces.find(p => p.samePosition(leftPosition));
            if(leftPiece && leftPiece.enPassant) {
                this.possibleMoves.push(leftCaptureMove);
            }
        }
        return this.possibleMoves;
    }
    isEnPassant (desiredPosition, pieces){
        const pawnDirection = this.team === 'white' ? 1 : -1;
        if ((desiredPosition.x - this.position.x === -1 || desiredPosition.x - this.position.x === 1) && desiredPosition.y - this.position.y === pawnDirection) {
            const piece = pieces.find(p => p.samePosition({
                x: desiredPosition.x,
                y: desiredPosition.y - pawnDirection
            }) && p.isPawn && p.enPassant);
            if (piece) return true;
        }
        return false;
    }
    clone(){
        return new Pawn(this.position.clone(), this.team, this.enPassant, this.possibleMoves.map(move => move.clone()));
    }
}