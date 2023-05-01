import { samePosition } from "../../Constants";
const tileIsOccupied = (currentPosition, boardState) => {
    const piece = boardState.find(p => samePosition(p.position, currentPosition));
    if (piece) return true;
    return false;
}
const pieceIsCaptured =(currentPosition, boardState, team) => {
    const piece = boardState.find(p => samePosition(p.position, currentPosition) && p.team !== team);
    if (piece) return true;
    return false;
}
const tileIsEmptyOrCaptured = (currentPosition, boardState, team) => {
    return (!tileIsOccupied(currentPosition, boardState) || pieceIsCaptured(currentPosition, boardState, team));
}
export {
    tileIsOccupied,
    pieceIsCaptured,
    tileIsEmptyOrCaptured
}