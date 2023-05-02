import {bishopLogic, getPossibleBishopMoves} from "./Bishop.rules";
import {rookLogic, getPossibleRookMoves} from "./Rook.rules";

const queenLogic = (initialPosition, currentPosition, boardState, team) => {
    const isRookMove1 = initialPosition.x === currentPosition.x && initialPosition.y !== currentPosition.y;
    const isRookMove2 = initialPosition.y === currentPosition.y && initialPosition.x !== currentPosition.x;
    if(isRookMove1 || isRookMove2) return rookLogic(initialPosition, currentPosition, boardState, team);
    return bishopLogic(initialPosition, currentPosition, boardState, team);
}
const getPossibleQueenMoves = (queen, boardState) => {
    const bishopMoves = getPossibleBishopMoves(queen, boardState);
    const rookMoves = getPossibleRookMoves(queen, boardState);
    return [...bishopMoves, ...rookMoves];
}
export {
    queenLogic,
    getPossibleQueenMoves,
}