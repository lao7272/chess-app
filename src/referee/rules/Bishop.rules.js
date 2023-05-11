import {Position} from "../../models/";
import { tileIsEmptyOrCaptured, tileIsOccupied } from "./General.rules";

const getPossibleBishopMoves = (bishop, boardState) => {
    const possibleMoves = [];
    const x = bishop.position.x;
    const y = bishop.position.y;
    // UPPER RIGHT
    for (let i = 1; i < 8; i++) {
        if(x + i > 7 || y + i > 7) break;
        let passedTile = new Position (x + i, y + i);
        if (tileIsEmptyOrCaptured(passedTile, boardState, bishop.team)) {
            possibleMoves.push(passedTile)
        };
        if (tileIsOccupied(passedTile, boardState)) break;
    }
    // UPPER LEFT
    for (let i = 1; i < 8; i++) {
        if(x - i < 0 || y + i > 7) break;
        let passedTile = new Position (x - i, y + i);
        if (tileIsEmptyOrCaptured(passedTile, boardState, bishop.team)) {
            possibleMoves.push(passedTile)
        };
        if (tileIsOccupied(passedTile, boardState)) break;
    }
    // BOTTOM RIGHT
    for (let i = 1; i < 8; i++) {
        if(x + i > 7 || y - i < 0) break;
        let passedTile = new Position (x + i, y - i);
        
        if (tileIsEmptyOrCaptured(passedTile, boardState, bishop.team)) {
            possibleMoves.push(passedTile)
        };
        if (tileIsOccupied(passedTile, boardState)) break;
    }
    // BOTTOM LEFT
    for (let i = 1; i < 8; i++) {
        if(x - i < 0 || y - i < 0) break;
        let passedTile = new Position (x - i, y - i);
        if (tileIsEmptyOrCaptured(passedTile, boardState, bishop.team)) {
            possibleMoves.push(passedTile)
        };
        if (tileIsOccupied(passedTile, boardState)) break;
    }
    return possibleMoves;
}
export default getPossibleBishopMoves;