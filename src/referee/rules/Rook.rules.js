import { Position } from "../../models";
import { tileIsEmptyOrCaptured, tileIsOccupied } from "./General.rules";


const rookLogic = (initialPosition, currentPosition, boardState, team) => {
    for (let i = 1; i < 8; i++) {
        const multiplierX = currentPosition.x > initialPosition.x ? 1 : -1;
        const multiplierY = currentPosition.y > initialPosition.y ? 1 : -1;
        const x = currentPosition.y === initialPosition.y ? initialPosition.x + i * multiplierX : initialPosition.x;
        const y = currentPosition.x === initialPosition.x ? initialPosition.y + i * multiplierY : initialPosition.y;
        const passedTile = new Position(x, y);
        if (passedTile.samePosition(currentPosition)) {
            if (tileIsEmptyOrCaptured(passedTile, boardState, team)) return true;
        } else {
            if (tileIsOccupied(passedTile, boardState)) break;
        }
    }
    return false;
}
const getPossibleRookMoves = (rook, boardState) => {
    const possibleMoves = [];
    const x = rook.position.x;
    const y = rook.position.y;
    // TOP
    for (let i = 1; i < 8; i++) {
        let passedTile = new Position(x, y + i);
        if (tileIsEmptyOrCaptured(passedTile, boardState, rook.team)) {
            possibleMoves.push(passedTile)
        };
        if (tileIsOccupied(passedTile, boardState)) break;
    }
    // BOTTOM
    for (let i = 1; i < 8; i++) {
        let passedTile = new Position(x, y - i);
        
        if (tileIsEmptyOrCaptured(passedTile, boardState, rook.team)) {
            possibleMoves.push(passedTile)
        };
        if (tileIsOccupied(passedTile, boardState)) break;
    }
    // RIGHT
    for (let i = 1; i < 8; i++) {
        let passedTile = new Position(x + i, y);
        if (tileIsEmptyOrCaptured(passedTile, boardState, rook.team)) {
            possibleMoves.push(passedTile)
        };
        if (tileIsOccupied(passedTile, boardState)) break;
    }
    // LEFT
    for (let i = 1; i < 8; i++) {
        let passedTile = new Position(x - i, y);
        if (tileIsEmptyOrCaptured(passedTile, boardState, rook.team)) {
            possibleMoves.push(passedTile)
        };
        if (tileIsOccupied(passedTile, boardState)) break;
    }
    return possibleMoves;
}
export {
rookLogic,
getPossibleRookMoves
}
    