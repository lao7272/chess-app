import Piece from "./Piece";
export default class Pawn extends Piece {
    constructor (position, team, enPassant, possibleMoves = []) {
        super(position, team, "pawn");
        this.enPassant = enPassant;
        this.possibleMoves = possibleMoves
    }
    clone(){
        return new Pawn(this.position.clone(), this.team, this.enPassant, this.possibleMoves.map(move => move.clone()));
    }
}