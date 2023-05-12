import Piece from "../Piece"; 
import Position from "../Positition";
import Movement from "./Movement";
const movement = new Movement();
export default class King extends Piece {
    constructor (position, team, hasMoved, possibleMoves = []) {
        super(position, team, "king", hasMoved, possibleMoves);
    }
    getPossibleMoves(pieces) {
        const x = this.position.x;
        const y = this.position.y;
        let passedTile = new Position(x + 1, y + 1);
        if(!(x + 1 > 7 || y + 1 > 7)) {
            if (movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team)) this.possibleMoves.push(passedTile);
        }
        if(!(x - 1 < 0 || y + 1 > 7)) {
            passedTile = new Position(x - 1, y + 1);
            if (movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team)) this.possibleMoves.push(passedTile);
        }
        if(!(x + 1 > 7 || y - 1 < 0)) {
            passedTile = new Position(x + 1, y - 1)
            if (movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team)) this.possibleMoves.push(passedTile);
        }
        if(!(x - 1 < 0 || y - 1 < 0)) {
            passedTile = new Position(x - 1, y - 1)
            if (movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team)) this.possibleMoves.push(passedTile);
        }
    
        if(!(y + 1 > 7)) {
            passedTile = new Position(x, y + 1);
            if (movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team)) this.possibleMoves.push(passedTile);
        }
        if(!(y - 1 < 0)) {
            passedTile = new Position(x, y - 1);
            if (movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team)) this.possibleMoves.push(passedTile);
        }
        if(!(x + 1 > 7)) {
            passedTile = new Position(x + 1, y);
            if (movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team)) this.possibleMoves.push(passedTile);
        }
        if(!(x - 1  < 0)) {
            passedTile = new Position(x - 1, y);
            if (movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team)) this.possibleMoves.push(passedTile);
        }
        return this.possibleMoves;
    }

    castling(pieces) {
        const possibleMoves = [];
        if (this.hasMoved) return possibleMoves;
        const rooks = pieces.filter(p => p.isRook && p.team === this.team && !p.hasMoved)
        for (const rook of rooks) {
            const direction = rook.position.x - this.position.x > 0 ? 1 : -1;
            const adjacentPosition = this.position.clone();
            adjacentPosition.x += direction;
    
            if(!rook.possibleMoves.some(m => m.samePosition(adjacentPosition))) continue;
    
            const castlingSquares = rook.possibleMoves.filter(m => m.y === this.position.y);
    
            let valid = true;
            const enemies = pieces.filter(p => p.team !== this.team);
            for (const enemy of enemies) {
                if(!enemy.possibleMoves) continue;
                for (const move of enemy.possibleMoves){
                    if(castlingSquares.some(s => s.samePosition(move))) valid = false;
                    if(!valid) break;
                }
                if(!valid) break;
            }
            if (!valid) continue;
            adjacentPosition.x += direction;
            possibleMoves.push(adjacentPosition);
        }
        return possibleMoves;
    }
    clone(){
        return new King(this.position.clone(), this.team, this.hasMoved, this.possibleMoves.map(move => move.clone()));
    }
}
