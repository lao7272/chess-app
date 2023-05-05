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
    if (tileIsEmptyOrCaptured(passedTile, boardState, king.team)) possibleMoves.push(passedTile);

    passedTile = new Position(x - 1, y + 1);
    if (tileIsEmptyOrCaptured(passedTile, boardState, king.team)) possibleMoves.push(passedTile);

    passedTile = new Position(x + 1, y - 1)
    if (tileIsEmptyOrCaptured(passedTile, boardState, king.team)) possibleMoves.push(passedTile);

    passedTile = new Position(x - 1, y - 1)
    if (tileIsEmptyOrCaptured(passedTile, boardState, king.team)) possibleMoves.push(passedTile);


    passedTile = new Position(x, y + 1);
    if (tileIsEmptyOrCaptured(passedTile, boardState, king.team)) possibleMoves.push(passedTile);

    passedTile = new Position(x, y - 1);
    if (tileIsEmptyOrCaptured(passedTile, boardState, king.team)) possibleMoves.push(passedTile);

    passedTile = new Position(x + 1, y);
    if (tileIsEmptyOrCaptured(passedTile, boardState, king.team)) possibleMoves.push(passedTile);

    passedTile = new Position(x - 1, y);
    if (tileIsEmptyOrCaptured(passedTile, boardState, king.team)) possibleMoves.push(passedTile);

    return possibleMoves;
}
export {
    kingLogic,
    getPossibleKingMoves
};