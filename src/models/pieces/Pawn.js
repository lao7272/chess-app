import Piece from "../Piece";
export default class Pawn extends Piece {
    constructor (position, team, hasMoved, enPassant, possibleMoves = []) {
        super(position, team, "pawn");
        this.hasMoved = hasMoved;
        this.enPassant = enPassant;
        this.possibleMoves = possibleMoves
    }
    clone(){
        return new Pawn(this.position.clone(), this.team, this.hasMoved, this.enPassant, this.possibleMoves.map(move => move.clone()));
    }
}