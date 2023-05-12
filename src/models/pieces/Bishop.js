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
        // UPPER RIGHT
        for (let i = 1; i < 8; i++) {
            if(x + i > 7 || y + i > 7) break;
            let passedTile = new Position (x + i, y + i);
            if (movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team)) {
                this.possibleMoves.push(passedTile)
            };
            if (movement.tileIsOccupied(passedTile, pieces)) break;
        }
        // UPPER LEFT
        for (let i = 1; i < 8; i++) {
            if(x - i < 0 || y + i > 7) break;
            let passedTile = new Position (x - i, y + i);
            if (movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team)) {
                this.possibleMoves.push(passedTile)
            };
            if (movement.tileIsOccupied(passedTile, pieces)) break;
        }
        // BOTTOM RIGHT
        for (let i = 1; i < 8; i++) {
            if(x + i > 7 || y - i < 0) break;
            let passedTile = new Position (x + i, y - i);
            
            if (movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team)) {
                this.possibleMoves.push(passedTile)
            };
            if (movement.tileIsOccupied(passedTile, pieces)) break;
        }
        // BOTTOM LEFT
        for (let i = 1; i < 8; i++) {
            if(x - i < 0 || y - i < 0) break;
            let passedTile = new Position (x - i, y - i);
            if (movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team)) {
                this.possibleMoves.push(passedTile)
            };
            if (movement.tileIsOccupied(passedTile, pieces)) break;
        }
        return this.possibleMoves;
    }
    clone(){
        return new Bishop(this.position.clone(), this.team, this.possibleMoves.map(move => move.clone()));
    }
}
