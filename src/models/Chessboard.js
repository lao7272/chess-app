import { 
    getPossibleBishopMoves, 
    getPossibleKingMoves, 
    getPossibleKnightMoves, 
    getPossiblePawnMoves, 
    getPossibleQueenMoves, 
    getPossibleRookMoves 
} from "../referee/rules";
export default class Chessboard {
    constructor (pieces) {
        this.pieces = pieces
    }
    getPossibleMoves(){
        for (const piece of this.pieces) {
            piece.possibleMoves = this.getValidMoves(piece);
        }
        this.getCheckMoves()
    }
    getCheckMoves () {
        const king = this.pieces.find(p => p.isKing && p.team === "black");

        if(!king)return;
        
        // KING MOVE RESTRICTIONS
        
        for (const move of king.possibleMoves) {
            // CREATES A CLONE OF THE BOARD TO SIMULATE THE KING MOVES
            const clonedBoard = this.clone();
            const filterTeamPieces = clonedBoard.pieces.filter(p => p.team !==  king.team);
            const clonedKing = clonedBoard.pieces.find(p => p.isKing && p.team === king.team);
            if(clonedBoard.pieces.find(p => p.samePosition(move))) {
                clonedBoard.pieces = clonedBoard.pieces.filter(p => !p.samePosition(move))
            }
            
            clonedKing.position = move;
            for(const enemy of filterTeamPieces){
                const newEnemy = this.pieces.find(p => p.samePosition(enemy.position) && p.team !== king.team);
                enemy.possibleMoves = clonedBoard.getValidMoves(newEnemy)
            }
            let safePosition = true; 

            for(const piece of clonedBoard.pieces){
                if (piece.team === king.team) continue;
                if(piece.isPawn) {
                    const possiblePawnMoves = clonedBoard.getValidMoves(piece);
                    
                    if (possiblePawnMoves.some(position => position.x !== piece.position.x &&  position.samePosition(move))) {
                        safePosition = false;
                    };
                } else if (piece.possibleMoves.some(position => position.samePosition(move))) {
                    safePosition = false;
                } 
            } 

            if(!safePosition){
                king.possibleMoves = king.possibleMoves.filter(m => !m.samePosition(move));
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
        if (isEnPassant) {
            this.pieces = this.pieces.reduce((result, piece) => {
                if (piece.samePosition(currentPiece.position)) {
                    if (piece.isPawn) piece.enPassant = false;
                    piece.position.x = x;
                    piece.position.y = y;
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
        return new Chessboard(this.pieces.map(piece => piece.clone()));
    }
} 