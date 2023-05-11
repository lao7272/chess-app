import getPossiblePawnMoves from "./Pawn.rules";
import {getPossibleKingMoves, castling} from "./King.rules";
import getPossibleQueenMoves from "./Queen.rules";
import getPossibleKnightMoves from "./Knight.rules";
import getPossibleBishopMoves from "./Bishop.rules";
import getPossibleRookMoves from "./Rook.rules";

export {
    getPossiblePawnMoves,
    getPossibleKnightMoves,
    getPossibleBishopMoves,
    getPossibleRookMoves,
    getPossibleQueenMoves,
    getPossibleKingMoves,
    castling
}