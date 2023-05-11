import { 
    getPossibleBishopMoves, 
    getPossibleKingMoves, 
    getPossibleKnightMoves, 
    getPossiblePawnMoves, 
    getPossibleQueenMoves, 
    getPossibleRookMoves,
    castling
} from "../referee/rules";
export default class Chessboard {
    constructor (pieces, totalTurns = 0) {
        this.pieces = pieces;
        this.totalTurns = totalTurns;
        this.winningTeam = null;
    }
    get getCurrentTeam(){
        return this.totalTurns % 2 === 0 ? "black" : "white";
    }
    getPossibleMoves(){
        for (const piece of this.pieces) {
            piece.possibleMoves = this.getValidMoves(piece);
        }
        const king = this.pieces.find(p => p.isKing && p.team === this.getCurrentTeam);
        // Castling
        king.possibleMoves = [...king.possibleMoves, ...castling(king, this.pieces)];
        // Checks the current team valid moves
        this.getTeamDangerousMoves();

        for (const piece of this.pieces) {
            if (piece.team !== this.getCurrentTeam) {
                piece.possibleMoves = [];
            }
        }
        const getTeamPieces = this.pieces.filter(p => p.team === this.getCurrentTeam);
        if(getTeamPieces.some(p => p.possibleMoves.length > 0 )) return;
        this.winningTeam = this.getCurrentTeam === 'white' ? "black" : "white";
    }
    
    getTeamDangerousMoves(){
        for (const piece of this.pieces.filter(p => p.team === this.getCurrentTeam)) {
            for (const move of piece.possibleMoves) {
                const clonedBoard = this.clone();
                clonedBoard.pieces = clonedBoard.pieces.filter(p => !p.samePosition(move))
                const clonedPiece = clonedBoard.pieces.find(p => p.samePosition(piece.position));
                clonedPiece.position = move.clone();
                const clonedKing  = clonedBoard.pieces.find(p => p.isKing && p.team === clonedBoard.getCurrentTeam);
                const filterTeamPieces = clonedBoard.pieces.filter(p => p.team !==  clonedBoard.getCurrentTeam);

                for(const enemy of filterTeamPieces){
                    const newEnemy = clonedBoard.pieces.find(p => p.samePosition(enemy.position) && p.team !== clonedBoard.getCurrentTeam);
                    enemy.possibleMoves = clonedBoard.getValidMoves(newEnemy);
                    if (enemy.isPawn){
                        const isDangerousMove = enemy.possibleMoves.some(m => m.x !== enemy.position.x && m.samePosition(clonedKing.position));
                        if(isDangerousMove) piece.possibleMoves = piece.possibleMoves.filter(m => !m.samePosition(move));
                    } else {
                        if(enemy.possibleMoves.some(m => m.samePosition(clonedKing.position))) piece.possibleMoves = piece.possibleMoves.filter(m => !m.samePosition(move));
                    }
                }
            }
        }
    }
    getValidMoves (piece) {
        switch (piece.type) {
            case 'pawn':
                return getPossiblePawnMoves(piece, this.pieces);
            case 'knight':
                return getPossibleKnightMoves(piece, this.pieces);
            case 'bishop':
                return getPossibleBishopMoves(piece, this.pieces);
            case 'rook':
                return getPossibleRookMoves(piece, this.pieces);
            case 'queen':
                return getPossibleQueenMoves(piece, this.pieces);
            case 'king':
                return getPossibleKingMoves(piece, this.pieces);
            default:
                return [];
        }
    }
    playMove(currentPiece, desiredPosition, isEnPassant, validMove){
        const { x, y } = desiredPosition;

        const pawnDirection = currentPiece.team === 'white' ? 1 : -1;
        
        if(currentPiece.isKing && (currentPiece.position.x - desiredPosition.x === 2 || currentPiece.position.x - desiredPosition.x === -2)){
            const xPosition = currentPiece.position.x - desiredPosition.x === 2 ? 0 : 7;
            const yPosition = currentPiece.team === "white" ? 0 : 7;
            const rook = this.pieces.find(p => p.isRook && p.position.x === xPosition && p.position.y === yPosition);
            if (rook) {
                this.pieces = this.pieces.map(p => {
                    if (p.samePosition(currentPiece.position)) {
                        p.position.x = desiredPosition.x;
                    } if (p.samePosition(rook.position)) {
                        const direction = xPosition === 0 ? -1 : 1;
                        p.position.x = desiredPosition.x - direction;
                    }
                    return p;
                })
            }
            this.getPossibleMoves();
        } else if (isEnPassant) {
            this.pieces = this.pieces.reduce((result, piece) => {
                if (piece.samePosition(currentPiece.position)) {
                    if (piece.isPawn) piece.enPassant = false;
                    piece.position.x = x;
                    piece.position.y = y;
                    piece.hasMoved = true;
                    result.push(piece);
                } else if (!piece.samePosition({x, y: y - pawnDirection})) {
                    if (piece.isPawn) piece.enPassant = false;
                    result.push(piece);
                }
                return result
            }, []);
            this.getPossibleMoves();
        } else if (validMove) {
            // UPDATES THE PIECE POSITION AND CAPTURES
            this.pieces = this.pieces.reduce((result, piece) => {
                if (piece.samePosition(currentPiece.position)) {
                    // Special pawn move
                    if (piece.isPawn) piece.enPassant = Math.abs(currentPiece.position.y - y) === 2;
                    piece.position.x = x;
                    piece.position.y = y;
                    piece.hasMoved = true;
                    result.push(piece);
                } else if (!piece.samePosition({x, y})) {
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

    clone(){
        return new Chessboard(this.pieces.map(piece => piece.clone()), this.totalTurns);
    }
} 