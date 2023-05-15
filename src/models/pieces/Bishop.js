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

            // UPPER RIGHT
            let passedTile = new Position (x + i, y + i);
            if (movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team) && upperRight) {
                this.possibleMoves.push(passedTile);
            };
            if (movement.tileIsOccupied(passedTile, pieces) && upperRight) upperRight = false;

            // UPPER LEFT
            passedTile = new Position (x - i, y + i);
            if (movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team) && upperLeft) {
                this.possibleMoves.push(passedTile);
            };
            if (movement.tileIsOccupied(passedTile, pieces) && upperLeft) upperLeft = false;
            // BOTTOM RIGHT
            passedTile = new Position (x + i, y - i);
            if (movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team) && bottomRight) {
                this.possibleMoves.push(passedTile);
            };
            if (movement.tileIsOccupied(passedTile, pieces) && bottomRight) bottomRight = false;

            // BOTTOM LEFT
            passedTile = new Position (x - i, y - i);
            if (movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team) && bottomLeft) {
                this.possibleMoves.push(passedTile);
            };
            if (movement.tileIsOccupied(passedTile, pieces) && bottomLeft) bottomLeft = false;

        }
        return this.possibleMoves;
    }
    clone(){
        return new Bishop(this.position.clone(), this.team, this.possibleMoves.map(move => move.clone()));
    }
}

// let upperConstraints = true;
// let bottomConstraints = true;
// for (let j = -1; j < 2; j += 2) {
//     if(x + (i * j) > 7 || y + i > 7) upperConstraints = false;
//     if(x + (i * j) < 0 || y - i < 0) bottomConstraints = false;
//     const upperMove = new Position(x + (i * j), y + i);
//     const bottomMove = new Position(x + (i * j), y - i);
//     if (movement.tileIsEmptyOrCaptured(upperMove, pieces, this.team) && upperConstraints) {
//         this.possibleMoves.push(upperMove);
//     };
//     if (movement.tileIsOccupied(upperMove, pieces) && upperConstraints) upperConstraints = false;

//     if (movement.tileIsEmptyOrCaptured(bottomMove, pieces, this.team) && bottomConstraints) {
//         this.possibleMoves.push(bottomMove);
//     };
//     if (movement.tileIsOccupied(bottomMove, pieces) && upperConstraints) bottomConstraints = false;
// }   