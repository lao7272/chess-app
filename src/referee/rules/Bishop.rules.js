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
export default bishopLogic;