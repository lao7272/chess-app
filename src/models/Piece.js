
export default class Piece{
    constructor (position, team, type, possibleMoves = []) {
        this.image = `./assets/images/${team}-${type}.png`;
        this.position = position;
        this.team = team;
        this.type = type;
        this.possibleMoves = possibleMoves;
    }
    get isPawn() {
        return this.type === "pawn";
    } 
    get isRook() {
        return this.type === "rook";
    }   
    get isKnight() {
        return this.type === "knight";
    } 
    get isBishop() {
        return this.type === "bishop";
    } 
    get isQueen() {
        return this.type === "queen";
    } 
    get isKing() {
        return this.type === "king";
    }
    samePosition(desiredPostion){
        return this.position.samePosition(desiredPostion);
    }

}
