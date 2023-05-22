import { Position, Chessboard} from "./models";
import { Pawn, Knight, Bishop, Rook, Queen, King } from "./models/pieces"

const GRID_SIZE = 62.5; 

const VERTICAL_AXIS = ['1', '2', '3', '4', '5', '6', '7', '8'];
const HORIZONTAL_AXIS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const initialChessboard = new Chessboard([
    new Rook(new Position (0, 7), "black", false),
    new Rook(new Position (7, 7), "black",  false),
    new Knight(new Position (1, 7), "black"),
    new Knight(new Position (6, 7), "black"),
    new Bishop(new Position (2, 7), "black"),
    new Bishop(new Position (5, 7), "black"),
    new Queen(new Position (3, 7), "black"),
    new King(new Position (4, 7), "black", false),
    new Rook(new Position (0, 0), "white", false),
    new Rook(new Position (7, 0), "white", false),
    new Knight(new Position (1, 0), "white"),
    new Knight(new Position (6, 0), "white"),
    new Bishop(new Position (2, 0), "white"),
    new Bishop(new Position (5, 0), "white"),
    new Queen(new Position (3, 0), "white"),
    new King(new Position (4, 0), "white", false),
    new Pawn(new Position (0, 6), "black", false),
    new Pawn(new Position (1, 6), "black", false),
    new Pawn(new Position (2, 6), "black", false),
    new Pawn(new Position (3, 6), "black", false),
    new Pawn(new Position (4, 6), "black", false),
    new Pawn(new Position (5, 6), "black", false),
    new Pawn(new Position (6, 6), "black", false),
    new Pawn(new Position (7, 6), "black", false),
    new Pawn(new Position (0, 1), "white", false),
    new Pawn(new Position (1, 1), "white", false),
    new Pawn(new Position (2, 1), "white", false),
    new Pawn(new Position (3, 1), "white", false),
    new Pawn(new Position (4, 1), "white", false),
    new Pawn(new Position (5, 1), "white", false),
    new Pawn(new Position (6, 1), "white", false),
    new Pawn(new Position (7, 1), "white", false)
], 1);
export {
    HORIZONTAL_AXIS,
    VERTICAL_AXIS, 
    initialChessboard,
    GRID_SIZE
}
