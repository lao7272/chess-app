import { samePosition } from "../../Constants";
import { tileIsEmptyOrCaptured, tileIsOccupied } from "./General.rules";

const bishopLogic = (initialPosition, currentPosition, boardState, team) => {
    for (let i = 1; i < 8; i++) {
        const x = currentPosition.x > initialPosition.x ? initialPosition.x + i : initialPosition.x - i;
        const y = currentPosition.y > initialPosition.y ? initialPosition.y + i : initialPosition.y - i;
        let passedTile = {x, y};
        if (samePosition(passedTile, currentPosition)) {
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
        let passedTile = {x: x + i, y: y + i};
        if (tileIsEmptyOrCaptured(passedTile, boardState, bishop.team)) {
            possibleMoves.push(passedTile)
        };
        if (tileIsOccupied(passedTile, boardState)) break;
    }
    // UPPER LEFT
    for (let i = 1; i < 8; i++) {
        let passedTile = {x: x - i, y: y + i};
        if (tileIsEmptyOrCaptured(passedTile, boardState, bishop.team)) {
            possibleMoves.push(passedTile)
        };
        if (tileIsOccupied(passedTile, boardState)) break;
    }
    // BOTTOM RIGHT
    for (let i = 1; i < 8; i++) {
        let passedTile = {x: x + i, y: y - i};
        
        if (tileIsEmptyOrCaptured(passedTile, boardState, bishop.team)) {
            possibleMoves.push(passedTile)
        };
        if (tileIsOccupied(passedTile, boardState)) break;
    }
    // BOTTOM LEFT
    for (let i = 1; i < 8; i++) {
        let passedTile = {x: x - i, y: y - i};
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