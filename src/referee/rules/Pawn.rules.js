import { tileIsOccupied, pieceIsCaptured } from "./General.rules";
const pawnLogic = (initialPosition, currentPosition, boardState, team) => {
    const specialRow = team === 'white' ? 1 : 6;
    const pawnDirection = team === 'white' ? 1 : -1;

    if (initialPosition.x === currentPosition.x && initialPosition.y === specialRow && currentPosition.y - initialPosition.y === 2 * pawnDirection) {
        if (!tileIsOccupied(currentPosition, boardState) && !tileIsOccupied({
                x: currentPosition.x,
                y: currentPosition.y - pawnDirection
            }, boardState)) return true;
    } else if (initialPosition.x === currentPosition.x && currentPosition.y - initialPosition.y === pawnDirection) {
        if (!tileIsOccupied(currentPosition, boardState)) return true;
    }
    // CAPTURE A PIECE
    else if (currentPosition.x - initialPosition.x === -1 && currentPosition.y - initialPosition.y === pawnDirection) {
        //CAPTURE IN UPPER OR BOTTOM LEFT CORNER
        if (pieceIsCaptured(currentPosition, boardState, team)) return true;
    } else if (currentPosition.x - initialPosition.x === 1 && currentPosition.y - initialPosition.y === pawnDirection) {
        //CAPTURE IN UPPER OR BOTTOM RIGHT CORNER
        if (pieceIsCaptured(currentPosition, boardState, team)) return true;
    }
    return false;
}

export default pawnLogic;