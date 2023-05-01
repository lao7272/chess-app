import { tileIsEmptyOrCaptured } from "./General.rules";

const knightLogic = (initialPosition, currentPosition, boardState, team) => {
    if (currentPosition.y - initialPosition.y === 2) {

    }
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
export default knightLogic;