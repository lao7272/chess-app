import {Position} from "../../models/";
import { tileIsEmptyOrCaptured, tileIsOccupied } from "./General.rules";

const bishopLogic = (initialPosition, currentPosition, boardState, team) => {
    for (let i = 1; i < 8; i++) {
        const x = currentPosition.x > initialPosition.x ? initialPosition.x + i : initialPosition.x - i;
        const y = currentPosition.y > initialPosition.y ? initialPosition.y + i : initialPosition.y - i;
        let passedTile = new Position(x, y);
        if (passedTile.samePosition(currentPosition)) {
            if (tileIsEmptyOrCaptured(passedTile, boardState, team)) return true;
        } else {
            if (tileIsOccupied(passedTile, boardState)) break;
        }
    }
    return false;
}

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
export {
    bishopLogic,
    getPossibleBishopMoves
}