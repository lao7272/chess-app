import { Position } from "../../models";
import { tileIsEmptyOrCaptured, tileIsOccupied } from "./General.rules";


const getPossibleRookMoves = (rook, boardState) => {
    const possibleMoves = [];
    const x = rook.position.x;
    const y = rook.position.y;
    // TOP
    for (let i = 1; i < 8; i++) {
        if(y + i > 7) break;
        let passedTile = new Position(x, y + i);
        if (tileIsEmptyOrCaptured(passedTile, boardState, rook.team)) {
            possibleMoves.push(passedTile)
        };
        if (tileIsOccupied(passedTile, boardState)) break;
    }
    // BOTTOM
    for (let i = 1; i < 8; i++) {
        if(y - i < 0) break;
        let passedTile = new Position(x, y - i);
        
        if (tileIsEmptyOrCaptured(passedTile, boardState, rook.team)) {
            possibleMoves.push(passedTile)
        };
        if (tileIsOccupied(passedTile, boardState)) break;
    }
    // RIGHT
    for (let i = 1; i < 8; i++) {
        if(x + i > 7) break;
        let passedTile = new Position(x + i, y);
        if (tileIsEmptyOrCaptured(passedTile, boardState, rook.team)) {
            possibleMoves.push(passedTile)
        };
        if (tileIsOccupied(passedTile, boardState)) break;
    }
    // LEFT
    for (let i = 1; i < 8; i++) {
        if(x - i < 0) break;
        let passedTile = new Position(x - i, y);
        if (tileIsEmptyOrCaptured(passedTile, boardState, rook.team)) {
            possibleMoves.push(passedTile)
        };
        if (tileIsOccupied(passedTile, boardState)) break;
    }
    return possibleMoves;
}
export default getPossibleRookMoves;
    