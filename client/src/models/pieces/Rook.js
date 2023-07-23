import Piece from "../Piece";
import Position from "../Positition";
import Movement from "./Movement";
const movement = new Movement();
export default class Rook extends Piece {
    constructor (position, team, hasMoved, possibleMoves = []) {
        super(position, team, "rook", possibleMoves);
        this.hasMoved = hasMoved;
    }

    getPossibleMoves(pieces) {
        const x = this.position.x;
        const y = this.position.y;
        let top = true;
        let bottom = true;
        let right = true;
        let left = true;
        for (let i = 1; i < 8; i++) {
            if(y + i > 7) top = false;
            if(y - i < 0) bottom = false;
            if(x + i > 7) right = false;
            if(x - i < 0) left = false;
            let passedTileTop = new Position(x, y + i);
            let passedTileBottom = new Position(x, y - i);
            let passedTileRight = new Position(x + i, y);
            let passedTileLeft = new Position(x - i, y);
            // TOP
            if (top && movement.tileIsEmptyOrCaptured(passedTileTop, pieces, this.team)) {
                this.possibleMoves.push(passedTileTop)
            };
            if (movement.tileIsOccupied(passedTileTop, pieces)) top = false;
            // BOTTOM
            if (bottom && movement.tileIsEmptyOrCaptured(passedTileBottom, pieces, this.team)) {
                this.possibleMoves.push(passedTileBottom)
            };
            if (movement.tileIsOccupied(passedTileBottom, pieces)) bottom = false;
            // RIGHT
            if (right && movement.tileIsEmptyOrCaptured(passedTileRight, pieces, this.team)) {
                this.possibleMoves.push(passedTileRight)
            };
            if (movement.tileIsOccupied(passedTileRight, pieces)) right = false;
            // LEFT
            if (left && movement.tileIsEmptyOrCaptured(passedTileLeft, pieces, this.team)) {
                this.possibleMoves.push(passedTileLeft)
            };
            if (movement.tileIsOccupied(passedTileLeft, pieces)) left = false;
        }
        return this.possibleMoves;
    }

    clone(){
        return new Rook(this.position.clone(), this.team, this.hasMoved, this.possibleMoves.map(move => move.clone()));
    }
}


