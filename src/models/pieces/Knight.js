import Piece from "../Piece";
import Position from "../Positition";
import Movement from "./Movement";
const movement = new Movement();
export default class Knight extends Piece {
    constructor (position, team, hasMoved, possibleMoves = []) {
        super(position, team, "knight", hasMoved, possibleMoves);
    }

    getPossibleMoves (pieces) {
        for (let i = -1; i < 2; i += 2) {
            for (let j = -1; j < 2; j += 2) {
                const verticalMove = new Position(this.position.x + j, this.position.y + i * 2);
                const horizontalMove = new Position(this.position.x + i * 2, this.position.y + j);
                if(verticalMove.x <= 7 && verticalMove.y >= 0 && verticalMove.x >= 0 && verticalMove.y <= 7) {
                    if (movement.tileIsEmptyOrCaptured(verticalMove, pieces, this.team)) {
                        this.possibleMoves.push(verticalMove);
                    }
                } 
                if(horizontalMove.x <= 7 && horizontalMove.y >= 0 && horizontalMove.x >= 0 && horizontalMove.y <= 7) {
                    if (movement.tileIsEmptyOrCaptured(horizontalMove, pieces, this.team)) {
                        this.possibleMoves.push(horizontalMove);
                    }
                }
                
            }
        }
        return this.possibleMoves;
    }
    clone(){
        return new Knight(this.position.clone(), this.team, this.hasMoved, this.possibleMoves.map(move => move.clone()));
    }
}
