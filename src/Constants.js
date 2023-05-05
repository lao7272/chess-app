import {Pawn, Piece, Position} from "./models";

const GRID_SIZE = 62.5; 

const VERTICAL_AXIS = ['1', '2', '3', '4', '5', '6', '7', '8'];
const HORIZONTAL_AXIS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const INITIAL_CHESSBOARD_STATE = [
    new Piece(new Position (0, 7), "black", "rook"),
    new Piece(new Position (7, 7), "black", "rook"),
    new Piece(new Position (1, 7), "black", "knight"),
    new Piece(new Position (6, 7), "black", "knight"),
    new Piece(new Position (2, 7), "black", "bishop"),
    new Piece(new Position (5, 7), "black", "bishop"),
    new Piece(new Position (3, 7), "black", "queen"),
    new Piece(new Position (4, 7), "black", "king"),
    new Piece(new Position (0, 0), "white", "rook"),
    new Piece(new Position (7, 0), "white", "rook"),
    new Piece(new Position (1, 0), "white", "knight"),
    new Piece(new Position (6, 0), "white", "knight"),
    new Piece(new Position (2, 0), "white", "bishop"),
    new Piece(new Position (5, 0), "white", "bishop"),
    new Piece(new Position (3, 0), "white", "queen"),
    new Piece(new Position (4, 0), "white", "king"),
    new Pawn(new Position (0, 6), "black"),
    new Pawn(new Position (1, 6), "black"),
    new Pawn(new Position (2, 6), "black"),
    new Pawn(new Position (3, 6), "black"),
    new Pawn(new Position (4, 6), "black"),
    new Pawn(new Position (5, 6), "black"),
    new Pawn(new Position (6, 6), "black"),
    new Pawn(new Position (7, 6), "black"),
    new Pawn(new Position (0, 1), "white"),
    new Pawn(new Position (1, 1), "white"),
    new Pawn(new Position (2, 1), "white"),
    new Pawn(new Position (3, 1), "white"),
    new Pawn(new Position (4, 1), "white"),
    new Pawn(new Position (5, 1), "white"),
    new Pawn(new Position (6, 1), "white"),
    new Pawn(new Position (7, 1), "white")
];

export {
    HORIZONTAL_AXIS,
    VERTICAL_AXIS, 
    INITIAL_CHESSBOARD_STATE,
    GRID_SIZE
}
