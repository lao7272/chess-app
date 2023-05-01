import {samePosition} from "../Constants";

export default class Referee {
    tileIsEmptyOrCaptured(currentPosition, boardState, team) {
        return (!this.tileIsOccupied(currentPosition, boardState) || this.pieceIsCaptured(currentPosition, boardState, team));
    }
    tileIsOccupied(currentPosition, boardState) {
        const piece = boardState.find(p => samePosition(p.position, currentPosition));
        if (piece) return true;
        return false;
    }
    pieceIsCaptured(currentPosition, boardState, team) {
        const piece = boardState.find(p => samePosition(p.position, currentPosition) && p.team !== team);
        if (piece) return true;
        return false;
    }
    isEnPassantCapture(initialPosition, currentPosition, boardState, team, type) {
        const pawnDirection = team === 'white' ? 1 : -1;
        if (type === 'PAWN') {
            if ((currentPosition.x - initialPosition.x === -1 || currentPosition.x - initialPosition.x === 1) && currentPosition.y - initialPosition.y === pawnDirection) {
                const piece = boardState.find(p => samePosition(p.position, {
                    x: currentPosition.x,
                    y: currentPosition.y - pawnDirection
                }) && p.enPassant === true);
                if (piece) return true;
            }

        }
        return false;
    }
    pawnLogic(initialPosition, currentPosition, boardState, team) {
        const specialRow = team === 'white' ? 1 : 6;
        const pawnDirection = team === 'white' ? 1 : -1;

        if (initialPosition.x === currentPosition.x && initialPosition.y === specialRow && currentPosition.y - initialPosition.y === 2 * pawnDirection) {
            if (!this.tileIsOccupied(currentPosition, boardState) && !this.tileIsOccupied({
                    x: currentPosition.x,
                    y: currentPosition.y - pawnDirection
                }, boardState)) return true;
        } else if (initialPosition.x === currentPosition.x && currentPosition.y - initialPosition.y === pawnDirection) {
            if (!this.tileIsOccupied(currentPosition, boardState)) return true;
        }
        // CAPTURE A PIECE
        else if (currentPosition.x - initialPosition.x === -1 && currentPosition.y - initialPosition.y === pawnDirection) {
            //CAPTURE IN UPPER OR BOTTOM LEFT CORNER
            if (this.pieceIsCaptured(currentPosition, boardState, team)) return true;
        } else if (currentPosition.x - initialPosition.x === 1 && currentPosition.y - initialPosition.y === pawnDirection) {
            //CAPTURE IN UPPER OR BOTTOM RIGHT CORNER
            if (this.pieceIsCaptured(currentPosition, boardState, team)) return true;
        }
        return false;
    }
    knightLogic(initialPosition, currentPosition, boardState, team) {
        if (currentPosition.y - initialPosition.y === 2) {

        }
        for (let i = -1; i < 2; i += 2) {
            for (let j = -1; j < 2; j += 2) {
                // TOP AND BOTTOM
                if (currentPosition.y - initialPosition.y === 2 * i) {
                    if (currentPosition.x - initialPosition.x === j) {
                        if (this.tileIsEmptyOrCaptured(currentPosition, boardState, team)) return true;
                    }
                }
                // RIGHT AND LEFT
                if (currentPosition.x - initialPosition.x === 2 * i) {
                    if (currentPosition.y - initialPosition.y === j) {
                        if (this.tileIsEmptyOrCaptured(currentPosition, boardState, team)) return true;
                    }
                }
            }
        }
        return false;
    }
    bishopLogic(initialPosition, currentPosition, boardState, team) {
        for (let i = 1; i < 8; i++) {
            const x = currentPosition.x > initialPosition.x ? initialPosition.x + i : initialPosition.x - i;
            const y = currentPosition.y > initialPosition.y ? initialPosition.y + i : initialPosition.y - i;
            let passedTile = {x, y};
            if (samePosition(passedTile, currentPosition)) {
                if (this.tileIsEmptyOrCaptured(passedTile, boardState, team)) return true;
            } else {
                if (this.tileIsOccupied(passedTile, boardState)) break;
            }
        }
        return false;
    }
    rookLogic(initialPosition, currentPosition, boardState, team) {
        for (let i = 1; i < 8; i++) {
            const multiplierX = currentPosition.x > initialPosition.x ? 1 : -1;
            const multiplierY = currentPosition.y > initialPosition.y ? 1 : -1;
            const x = currentPosition.y === initialPosition.y ? initialPosition.x + i * multiplierX : initialPosition.x;
            const y = currentPosition.x === initialPosition.x ? initialPosition.y + i * multiplierY : initialPosition.y;
            const passedTile = {x, y};
            if (samePosition(passedTile, currentPosition)) {
                if (this.tileIsEmptyOrCaptured(passedTile, boardState, team)) return true;
            } else {
                if (this.tileIsOccupied(passedTile, boardState)) break;
            }
        }
        return false;
    }
    queenLogic(initialPosition, currentPosition, boardState, team) {
        const isRookMove1 = initialPosition.x === currentPosition.x && initialPosition.y !== currentPosition.y;
        const isRookMove2 = initialPosition.y === currentPosition.y && initialPosition.x !== currentPosition.x;
        if(isRookMove1 || isRookMove2) return this.rookLogic(initialPosition, currentPosition, boardState, team);
        return this.bishopLogic(initialPosition, currentPosition, boardState, team);
    }
    kingLogic(initialPosition, currentPosition, boardState, team){
        const multiplierY = currentPosition.y > initialPosition.y ? 1 : currentPosition.y < initialPosition.y ? -1 : 0;
        const multiplierX = currentPosition.x > initialPosition.x ? 1 : currentPosition.x < initialPosition.x ? -1 : 0;

        const passedTile = {x: initialPosition.x + (1 * multiplierX), y: initialPosition.y + (1 * multiplierY)}
        if (samePosition(passedTile, currentPosition)) {
            if (this.tileIsEmptyOrCaptured(currentPosition, boardState, team)) return true;
        }
        return false;
    }
    isValidMove(initialPosition, currentPosition, boardState, team, type) {
        switch (type) {
            case 'PAWN':
                return this.pawnLogic(initialPosition, currentPosition, boardState, team);
            case 'KNIGHT':
                return this.knightLogic(initialPosition, currentPosition, boardState, team);
            case 'BISHOP':
                return this.bishopLogic(initialPosition, currentPosition, boardState, team);
            case 'ROOK':
                return this.rookLogic(initialPosition, currentPosition, boardState, team);
            case 'QUEEN':
                return this.queenLogic(initialPosition, currentPosition, boardState, team);
            case 'KING':
                return this.kingLogic(initialPosition, currentPosition, boardState, team);
            default:
                return false;
        }
    }
}