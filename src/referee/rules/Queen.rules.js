import bishopLogic from "./Bishop.rules";
import rookLogic from "./Rook.rules";

const queenLogic = (initialPosition, currentPosition, boardState, team) => {
    const isRookMove1 = initialPosition.x === currentPosition.x && initialPosition.y !== currentPosition.y;
    const isRookMove2 = initialPosition.y === currentPosition.y && initialPosition.x !== currentPosition.x;
    if(isRookMove1 || isRookMove2) return rookLogic(initialPosition, currentPosition, boardState, team);
    return bishopLogic(initialPosition, currentPosition, boardState, team);
}

export default queenLogic;