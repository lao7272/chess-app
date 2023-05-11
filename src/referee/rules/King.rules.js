import { Position } from "../../models";
import { tileIsEmptyOrCaptured } from "./General.rules";


const kingLogic = (initialPosition, currentPosition, boardState, team) => {
    const multiplierY = currentPosition.y > initialPosition.y ? 1 : currentPosition.y < initialPosition.y ? -1 : 0;
    const multiplierX = currentPosition.x > initialPosition.x ? 1 : currentPosition.x < initialPosition.x ? -1 : 0;

    const passedTile = new Position(initialPosition.x + (1 * multiplierX), initialPosition.y + (1 * multiplierY));
    if (passedTile.samePosition(currentPosition)) {
        if (tileIsEmptyOrCaptured(currentPosition, boardState, team)) return true;
    }
    return false;
}
const getPossibleKingMoves = (king, boardState) => {
    const possibleMoves = [];
    const x = king.position.x;
    const y = king.position.y;
    let passedTile = new Position(x + 1, y + 1);
    if(!(x + 1 > 7 || y + 1 > 7)) {
        if (tileIsEmptyOrCaptured(passedTile, boardState, king.team)) possibleMoves.push(passedTile);
    }
    if(!(x - 1 < 0 || y + 1 > 7)) {
        passedTile = new Position(x - 1, y + 1);
        if (tileIsEmptyOrCaptured(passedTile, boardState, king.team)) possibleMoves.push(passedTile);
    }
    if(!(x + 1 > 7 || y - 1 < 0)) {
        passedTile = new Position(x + 1, y - 1)
        if (tileIsEmptyOrCaptured(passedTile, boardState, king.team)) possibleMoves.push(passedTile);
    }
    if(!(x - 1 < 0 || y - 1 < 0)) {
        passedTile = new Position(x - 1, y - 1)
        if (tileIsEmptyOrCaptured(passedTile, boardState, king.team)) possibleMoves.push(passedTile);
    }

    if(!(y + 1 > 7)) {
        passedTile = new Position(x, y + 1);
        if (tileIsEmptyOrCaptured(passedTile, boardState, king.team)) possibleMoves.push(passedTile);
    }
    if(!(y - 1 < 0)) {
        passedTile = new Position(x, y - 1);
        if (tileIsEmptyOrCaptured(passedTile, boardState, king.team)) possibleMoves.push(passedTile);
    }
    if(!(x + 1 > 7)) {
        passedTile = new Position(x + 1, y);
        if (tileIsEmptyOrCaptured(passedTile, boardState, king.team)) possibleMoves.push(passedTile);
    }
    if(!(x - 1  < 0)) {
        passedTile = new Position(x - 1, y);
        if (tileIsEmptyOrCaptured(passedTile, boardState, king.team)) possibleMoves.push(passedTile);
    }

    return possibleMoves;
}
const castling = (king, boardState) => {
    const possibleMoves = [];
    if (king.hasMoved) return possibleMoves;
    const rooks = boardState.filter(p => p.isRook && p.team === king.team && !p.hasMoved)
    for (const rook of rooks) {
        const direction = rook.position.x - king.position.x > 0 ? 1 : -1;
        const adjacentPosition = king.position.clone();
        adjacentPosition.x += direction;

        if(!rook.possibleMoves.some(m => m.samePosition(adjacentPosition))) continue;

        const castlingSquares = rook.possibleMoves.filter(m => m.y === king.position.y);

        let valid = true;
        const enemies = boardState.filter(p => p.team !== king.team);
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
export {
    kingLogic,
    getPossibleKingMoves,
    castling
};