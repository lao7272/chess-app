import Position from "./Positition";
import { Bishop, King, Knight, Pawn, Queen, Rook } from "./pieces";

export default class Chessboard {
    constructor(pieces, totalTurns = 1, moveList = [], onlineTeam = null) {
        this.pieces = pieces;
        this.onlineTeam = onlineTeam;
        this.totalTurns = totalTurns;
        this.moveList = moveList;
        this.winningTeam = null;
        this.draw = false;
    }
    get getCurrentTeam() {
        return this.totalTurns % 2 === 0 ? "black" : "white";
    }
    getPossibleMoves() {
        if (this.onlineTeam && this.onlineTeam !== this.getCurrentTeam) {
            for (const piece of this.pieces) {
                if (piece.team !== this.onlineTeam) {
                    piece.possibleMoves = [];
                }
            }
            return
        }
        if (this.pieces.length === 2) {
            this.draw = true;
            return;
        }
        for (const piece of this.pieces) {
            piece.possibleMoves = piece.getPossibleMoves(this.pieces);
        }
        const currentTeam = this.getCurrentTeam;
        const king = this.pieces.find(p => p.isKing && p.team === currentTeam);
        // Castling
        king.possibleMoves = [...king.possibleMoves, ...king.castling(this.pieces)];
        // Checks the current team valid moves
        this.getTeamDangerousMoves();

        for (const piece of this.pieces) {
            if (piece.team !== currentTeam) {
                piece.possibleMoves = [];
            }
        }
        const getTeamPieces = this.pieces.filter(p => p.team === currentTeam);
        if (getTeamPieces.some(p => p.possibleMoves.length > 0)) return;
        if (this.isKingChecked(king)) {
            this.winningTeam = this.getCurrentTeam === 'white' ? "black" : "white";
        } else {
            this.draw = true;
        }
    }

    getTeamDangerousMoves() {

        for (const piece of this.pieces.filter(p => p.team === this.getCurrentTeam)) {
            for (const move of piece.possibleMoves) {
                // Simulate the chessboard 
                const clonedBoard = this.clone();
                clonedBoard.pieces = clonedBoard.pieces.filter(p => !p.samePosition(move));
                const clonedPiece = clonedBoard.pieces.find(p => p.samePosition(piece.position));
                clonedPiece.position = move.clone();
                const clonedKing = clonedBoard.pieces.find(p => p.isKing && p.team === clonedBoard.getCurrentTeam);
                const filterTeamPieces = clonedBoard.pieces.filter(p => p.team !== clonedBoard.getCurrentTeam);

                for (const enemy of filterTeamPieces) {
                    enemy.possibleMoves = [];
                    const newEnemy = clonedBoard.pieces.find(p => p.samePosition(enemy.position) && p.team !== clonedBoard.getCurrentTeam);
                    enemy.possibleMoves = newEnemy.getPossibleMoves(clonedBoard.pieces);
                    if (enemy.isPawn) {
                        const isDangerousMove = enemy.possibleMoves.some(m => m.x !== enemy.position.x && m.samePosition(clonedKing.position));
                        if (isDangerousMove) piece.possibleMoves = piece.possibleMoves.filter(m => !m.samePosition(move));
                    } else {
                        if (enemy.possibleMoves.some(m => m.samePosition(clonedKing.position))) {
                            piece.possibleMoves = piece.possibleMoves.filter(m => !m.samePosition(move));
                        };
                    }
                }
            }
        }
    }
    isKingChecked(king) {
        for (const enemy of this.pieces.filter(p => p.team !== this.getCurrentTeam)) {
            const isChecked = enemy.getPossibleMoves(this.pieces).some(m => m.samePosition(king.position));
            if (isChecked) return true;
        }
        return false;
    }
    playMove(currentPiece, desiredPosition, validMove) {
        const { x, y } = desiredPosition;

        const pawnDirection = currentPiece.team === 'white' ? 1 : -1;
        let isEnPassant = false;
        if (currentPiece.type === "pawn") {
            isEnPassant = currentPiece.isEnPassant(desiredPosition, this.pieces);
        }

        if (currentPiece.isKing && (currentPiece.position.x - desiredPosition.x === 2 || currentPiece.position.x - desiredPosition.x === -2)) {
            const xPosition = currentPiece.position.x - desiredPosition.x === 2 ? 0 : 7;
            const yPosition = currentPiece.team === "white" ? 0 : 7;

            // Check castling
            const rook = this.pieces.find(p => p.isRook && p.position.x === xPosition && p.position.y === yPosition);
            if (rook) {
                this.pieces = this.pieces.map(piece => {
                    if (piece.samePosition(currentPiece.position)) {
                        piece.position.x = desiredPosition.x;
                    } if (piece.samePosition(rook.position)) {
                        const direction = xPosition === 0 ? -1 : 1;
                        piece.position.x = desiredPosition.x - direction;
                    }
                    return piece;
                })
            }
            this.getPossibleMoves();
        }
        // Check enPassant
        else if (isEnPassant) {
            this.pieces = this.pieces.reduce((result, piece) => {
                if (piece.samePosition(currentPiece.position)) {
                    if (piece.isPawn) piece.enPassant = false;
                    piece.position.x = x;
                    piece.position.y = y;
                    piece.hasMoved = true;
                    result.push(piece);


                } else if (!piece.samePosition({ x, y: y - pawnDirection })) {
                    if (piece.isPawn) piece.enPassant = false;
                    result.push(piece);
                }
                return result
            }, []);
            this.getPossibleMoves();
        }
        // Checks valid move
        else if (validMove) {
            // UPDATES THE PIECE POSITION AND CAPTURES
            this.pieces = this.pieces.reduce((result, piece) => {
                if (piece.samePosition(currentPiece.position)) {
                    // Special pawn move
                    if (piece.isPawn) piece.enPassant = Math.abs(currentPiece.position.y - y) === 2;
                    if (piece.isKing || piece.isRook) {
                        piece.hasMoved = true;
                    }
                    piece.position.x = x;
                    piece.position.y = y;
                    result.push(piece);


                } else if (!piece.samePosition({ x, y })) {
                    if (piece.isPawn) piece.enPassant = false;
                    result.push(piece);
                }
                return result
            }, []);
            this.getPossibleMoves();
        } else {
            return false;
        }
        return true
    }

    addOnlineProperties(pieces, moveList) {
        const newPieces = [];
        const newMoveList = [];
        
        for (const piece of pieces) {
            switch (piece.type) {
                case "pawn":
                    //piece.position.x, piece.position.y
                    newPieces.push(new Pawn(new Position(piece.position.x, piece.position.y), piece.team, piece.enPassant));
                    break;
                case "bishop":
                    newPieces.push(new Bishop(new Position(piece.position.x, piece.position.y), piece.team));
                    break;
                case "rook":
                    newPieces.push(new Rook(new Position(piece.position.x, piece.position.y), piece.team, piece.hasMoved));
                    break;
                case "knight":
                    newPieces.push(new Knight(new Position(piece.position.x, piece.position.y), piece.team));
                    break;
                case "queen":
                    newPieces.push(new Queen(new Position(piece.position.x, piece.position.y), piece.team));
                    break;
                case "king":
                    newPieces.push(new King(new Position(piece.position.x, piece.position.y), piece.team, piece.hasMoved));
                    break;
            }
            
        }
        
        for (const moveArray of moveList) {
            const newMoveArray = [];
            for(const move of moveArray) {
                const newMove = {
                    prevPosition: new Position(move.prevPosition.x, move.prevPosition.y),
                    position: new Position(move.position.x, move.position.y),
                    ...move
                }
                newMoveArray.push(newMove);
            }
            newMoveList.push(newMoveArray)
        }
        this.pieces = newPieces;
        this.moveList = newMoveList;
        this.getPossibleMoves()
    }
    clone() {
        return new Chessboard(this.pieces.map(piece => piece.clone()), this.totalTurns, this.moveList, this.onlineTeam);
    }
} 