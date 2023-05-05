import { Position } from "../../models";
import { tileIsEmptyOrCaptured } from "./General.rules";

const knightLogic = (initialPosition, currentPosition, boardState, team) => {

    for (let i = -1; i < 2; i += 2) {
        for (let j = -1; j < 2; j += 2) {
            // TOP AND BOTTOM
            if (currentPosition.y - initialPosition.y === 2 * i) {
                if (currentPosition.x - initialPosition.x === j) {
                    if (tileIsEmptyOrCaptured(currentPosition, boardState, team)) return true;
                }
            }
            // RIGHT AND LEFT
            if (currentPosition.x - initialPosition.x === 2 * i) {
                if (currentPosition.y - initialPosition.y === j) {
                    if (tileIsEmptyOrCaptured(currentPosition, boardState, team)) return true;
                }
            }
        }
    }
    return false;
}
const getPossibleKnightMoves = (knight, boardState) => {
    const possibleMoves = [];
    for (let i = -1; i < 2; i += 2) {
        for (let j = -1; j < 2; j += 2) {
            const verticalMove = new Position(knight.position.x + j,knight.position.y + i * 2);
            const horizontalMove = new Position(knight.position.x + i * 2, knight.position.y + j);

            if (tileIsEmptyOrCaptured(verticalMove, boardState, knight.team)) {
                possibleMoves.push(verticalMove);
            }
            if (tileIsEmptyOrCaptured(horizontalMove, boardState, knight.team)) {
                possibleMoves.push(horizontalMove);
            }
        }
    }
    return possibleMoves;
}
export {
    knightLogic,
    getPossibleKnightMoves
}