import getPossibleBishopMoves from "./Bishop.rules";
import getPossibleRookMoves from "./Rook.rules";

const getPossibleQueenMoves = (queen, boardState) => {
    const bishopMoves = getPossibleBishopMoves(queen, boardState);
    const rookMoves = getPossibleRookMoves(queen, boardState);
    return [...bishopMoves, ...rookMoves];
}
export default getPossibleQueenMoves;