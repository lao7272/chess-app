import { samePosition } from "../../Constants";
import { tileIsEmptyOrCaptured } from "./General.rules";

const kingLogic = (initialPosition, currentPosition, boardState, team) => {
    const multiplierY = currentPosition.y > initialPosition.y ? 1 : currentPosition.y < initialPosition.y ? -1 : 0;
    const multiplierX = currentPosition.x > initialPosition.x ? 1 : currentPosition.x < initialPosition.x ? -1 : 0;

    const passedTile = {x: initialPosition.x + (1 * multiplierX), y: initialPosition.y + (1 * multiplierY)}
    if (samePosition(passedTile, currentPosition)) {
        if (tileIsEmptyOrCaptured(currentPosition, boardState, team)) return true;
    }
    return false;
}
export default kingLogic;