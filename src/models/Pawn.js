import Piece from "./Piece";
export default class Pawn extends Piece {
    constructor (position, team) {
        super(position, team, "pawn");
    }
}