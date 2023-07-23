import Piece from "../Piece";
import Position from "../Positition";
import Movement from "./Movement";
const movement = new Movement();
export default class Bishop extends Piece {
    constructor (position, team, possibleMoves = []) {
        super(position, team, "bishop", possibleMoves);
    }
    getPossibleMoves (pieces) {
        const x = this.position.x;
        const y = this.position.y;
        let upperRight = true;
        let upperLeft = true;
        let bottomRight = true; 
        let bottomLeft = true;

        for (let i = 1; i < 8; i++) {
            if(x + i > 7 || y + i > 7) upperRight = false;
            if(x - i < 0 || y + i > 7) upperLeft = false;
            if(x + i > 7 || y - i < 0) bottomRight = false;
            if(x - i < 0 || y - i < 0) bottomLeft = false;

            let upperRightPassedTile = new Position (x + i, y + i);
            let upperLeftPassedTile = new Position (x - i, y + i);
            let bottomRightPassedTile = new Position (x + i, y - i);
            let bottomLeftPassedTile  = new Position (x - i, y - i);

            // UPPER RIGHT
            if (movement.tileIsEmptyOrCaptured(upperRightPassedTile, pieces, this.team) && upperRight) {
                this.possibleMoves.push(upperRightPassedTile);
            };
            if (movement.tileIsOccupied(upperRightPassedTile, pieces) && upperRight) upperRight = false;

            // UPPER LEFT
            if (movement.tileIsEmptyOrCaptured(upperLeftPassedTile, pieces, this.team) && upperLeft) {
                this.possibleMoves.push(upperLeftPassedTile);
            };
            if (movement.tileIsOccupied(upperLeftPassedTile, pieces) && upperLeft) upperLeft = false;

            // BOTTOM RIGHT
            if (movement.tileIsEmptyOrCaptured(bottomRightPassedTile, pieces, this.team) && bottomRight) {
                this.possibleMoves.push(bottomRightPassedTile);
            };
            if (movement.tileIsOccupied(bottomRightPassedTile, pieces) && bottomRight) bottomRight = false;

            // BOTTOM LEFT
            if (movement.tileIsEmptyOrCaptured(bottomLeftPassedTile, pieces, this.team) && bottomLeft) {
                this.possibleMoves.push(bottomLeftPassedTile);
            };
            if (movement.tileIsOccupied(bottomLeftPassedTile, pieces) && bottomLeft) bottomLeft = false;
        }
        return this.possibleMoves;
    }
    clone(){
        return new Bishop(this.position.clone(), this.team, this.possibleMoves.map(move => move.clone()));
    }
}