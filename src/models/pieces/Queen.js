import Piece from "../Piece"; 
import Position from "../Positition";
import Movement from "./Movement";
const movement = new Movement();
export default class Queen extends Piece {
    constructor (position, team, hasMoved, possibleMoves = []) {
        super(position, team, "queen", hasMoved, possibleMoves);
    }
    getPossibleMoves(pieces) {
        const x = this.position.x;
        const y = this.position.y;
        // TOP
        for (let i = 1; i < 8; i++) {
            if(y + i > 7) break;
            let passedTile = new Position(x, y + i);
            if (movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team)) {
                this.possibleMoves.push(passedTile)
            };
            if (movement.tileIsOccupied(passedTile, pieces)) break;
        }
        // BOTTOM
        for (let i = 1; i < 8; i++) {
            if(y - i < 0) break;
            let passedTile = new Position(x, y - i);
            
            if (movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team)) {
                this.possibleMoves.push(passedTile)
            };
            if (movement.tileIsOccupied(passedTile, pieces)) break;
        }
        // RIGHT
        for (let i = 1; i < 8; i++) {
            if(x + i > 7) break;
            let passedTile = new Position(x + i, y);
            if (movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team)) {
                this.possibleMoves.push(passedTile)
            };
            if (movement.tileIsOccupied(passedTile, pieces)) break;
        }
        // LEFT
        for (let i = 1; i < 8; i++) {
            if(x - i < 0) break;
            let passedTile = new Position(x - i, y);
            if (movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team)) {
                this.possibleMoves.push(passedTile)
            };
            if (movement.tileIsOccupied(passedTile, pieces)) break;
        }
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
        return new Queen(this.position.clone(), this.team, this.hasMoved, this.possibleMoves.map(move => move.clone()));
    }
}
