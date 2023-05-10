import {pawnLogic, getPossiblePawnMoves} from "./Pawn.rules";
import {kingLogic, getPossibleKingMoves, castling} from "./King.rules";
import {queenLogic, getPossibleQueenMoves} from "./Queen.rules";
import {knightLogic, getPossibleKnightMoves} from "./Knight.rules";
import {bishopLogic, getPossibleBishopMoves} from "./Bishop.rules";
import {rookLogic, getPossibleRookMoves} from "./Rook.rules";

export {
    pawnLogic, 
    kingLogic,
    queenLogic,
    knightLogic,
    bishopLogic,
    rookLogic,
    getPossiblePawnMoves,
    getPossibleKnightMoves,
    getPossibleBishopMoves,
    getPossibleRookMoves,
    getPossibleQueenMoves,
    getPossibleKingMoves,
    castling
}