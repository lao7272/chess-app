import { samePosition } from "../Constants";

export default class Referee {
    tileIsEmptyOrCaptured(currentPosition, boardState, team) {
        return (!this.tileIsOccupied(currentPosition, boardState) || this.pieceIsCaptured(currentPosition, boardState, team));
    }
    tileIsOccupied (currentPosition, boardState) {
        const piece = boardState.find(p => samePosition(p.position, currentPosition));
        if (piece) return true;
        return false;
    }
    pieceIsCaptured(currentPosition, boardState, team) {
        const piece = boardState.find(p => samePosition(p.position, currentPosition) && p.team !== team);
        if (piece) return true;
        return false;
    }
    isEnPassantCapture (initialPosition, currentPosition, boardState, team, type){
        const pawnDirection = team === 'white' ? 1 : -1;
        if (type === 'PAWN') {
            if((currentPosition.x - initialPosition.x === -1 || currentPosition.x - initialPosition.x === 1) && currentPosition.y - initialPosition.y === pawnDirection){
                const piece = boardState.find(p => samePosition(p.position, {x: currentPosition.x, y: currentPosition.y - pawnDirection}) && p.enPassant === true);
                if (piece) return true;
            } 
            
        }
        return false;
    }
    isValidMove (initialPosition, currentPosition, boardState, team, type) {
        // MOVEMENT LOGIC
        if (type === "PAWN"){
            const specialRow = team === 'white' ? 1 : 6;
            const pawnDirection = team === 'white' ? 1 : -1;

            if (initialPosition.x === currentPosition.x && initialPosition.y === specialRow && currentPosition.y - initialPosition.y === 2 * pawnDirection) {
                if(!this.tileIsOccupied(currentPosition, boardState) && !this.tileIsOccupied({x: currentPosition.x, y: currentPosition.y - pawnDirection}, boardState)) return true; 
            } else if (initialPosition.x === currentPosition.x && currentPosition.y - initialPosition.y === pawnDirection) {
                if(!this.tileIsOccupied(currentPosition, boardState)) return true;
            }
            // CAPTURE A PIECE
            else if(currentPosition.x - initialPosition.x === -1 && currentPosition.y - initialPosition.y === pawnDirection){
                //CAPTURE IN UPPER OR BOTTOM LEFT CORNER
                if(this.pieceIsCaptured(currentPosition, boardState, team))return true;
            } else if(currentPosition.x - initialPosition.x === 1 && currentPosition.y - initialPosition.y === pawnDirection) {
                //CAPTURE IN UPPER OR BOTTOM RIGHT CORNER
                if(this.pieceIsCaptured(currentPosition, boardState, team))return true;
            }
        } else if (type=== "KNIGHT"){
            for (let i = -1; i < 2; i+=2) {
                for (let j = -1; j < 2; j+=2) {
                    // TOP AND BOTTOM
                    if (currentPosition.y - initialPosition.y === 2 * i) {
                        if (currentPosition.x - initialPosition.x === j) {
                            if (this.tileIsEmptyOrCaptured(currentPosition, boardState, team)) return true;
                        }
                    } 
                    // RIGHT AND LEFT
                    if (currentPosition.x - initialPosition.x === 2 * i) {
                        if(currentPosition.y - initialPosition.y === j) {
                            if (this.tileIsEmptyOrCaptured(currentPosition, boardState, team)) return true;  
                        }
                    }
                }
            }
        } else if (type=== "BISHOP") {
            for (let i = 1; i < 8; i++) {
                // UPPER RIGHT
                if (currentPosition.x > initialPosition.x && currentPosition.y > initialPosition.y ) {
                    let passedTile = {x: initialPosition.x + i, y: initialPosition.y + i};
                    if (samePosition(passedTile, currentPosition)) {
                        if (this.tileIsEmptyOrCaptured(passedTile, boardState, team)) return true;
                    } else {
                        if(this.tileIsOccupied(passedTile, boardState)) break;
                    }
                }
                // UPPER LEFT
                if (currentPosition.x < initialPosition.x && currentPosition.y > initialPosition.y ) {
                    let passedTile = {x: initialPosition.x - i, y: initialPosition.y + i}
                    if (samePosition(passedTile, currentPosition)) {
                        if (this.tileIsEmptyOrCaptured(passedTile, boardState, team)) return true;
                    } else {
                        if(this.tileIsOccupied(passedTile, boardState)) break;
                    }
                }
                
                // BOTTOM RIGHT
                if (currentPosition.x > initialPosition.x && currentPosition.y < initialPosition.y ) {
                    let passedTile = {x: initialPosition.x + i, y: initialPosition.y - i}
                    if (samePosition(passedTile, currentPosition)) {
                        if (this.tileIsEmptyOrCaptured(passedTile, boardState, team)) return true;
                    } else {
                        if(this.tileIsOccupied(passedTile, boardState)) break;
                    }
                }
                // BOTTOM LEFT
                if (currentPosition.x < initialPosition.x && currentPosition.y < initialPosition.y ) {
                    let passedTile = {x: initialPosition.x - i, y: initialPosition.y - i}
                    if (samePosition(passedTile, currentPosition)) {
                        if (this.tileIsEmptyOrCaptured(passedTile, boardState, team)) return true;
                    } else {
                        if(this.tileIsOccupied(passedTile, boardState)) break;
                    }
                }
            }
        } else if (type=== "ROOK") {
            for (let i = 1; i < 8; i++) {
                // RIGHT
                if (currentPosition.x > initialPosition.x) {
                    const passedTile = {x: initialPosition.x + i, y: initialPosition.y}
                    if (samePosition(passedTile, currentPosition)) {
                        if(this.tileIsEmptyOrCaptured(passedTile, boardState, team)) return true;
                    } else {
                        if (this.tileIsOccupied(passedTile, boardState)) {
                            break;
                        }
                    }
                }
                // LEFT
                if (currentPosition.x < initialPosition.x) {
                    const passedTile = {x: initialPosition.x - i, y: initialPosition.y}
                    if (samePosition(passedTile, currentPosition)) {
                        if(this.tileIsEmptyOrCaptured(passedTile, boardState, team)) return true;
                    } else {
                        if (this.tileIsOccupied(passedTile, boardState)) {
                            break;
                        }
                    }
                }
                //TOP
                if (currentPosition.y > initialPosition.y) {
                    const passedTile = {x: initialPosition.x, y: initialPosition.y + i}
                    if (samePosition(passedTile, currentPosition)) {
                        if(this.tileIsEmptyOrCaptured(passedTile, boardState, team)) return true;
                    } else {
                        if (this.tileIsOccupied(passedTile, boardState)) {
                            break;
                        }
                    }
                }
                // BOTTOM
                if (currentPosition.y < initialPosition.y) {
                    const passedTile = {x: initialPosition.x, y: initialPosition.y - i}
                    if (samePosition(passedTile, currentPosition)) {
                        if(this.tileIsEmptyOrCaptured(passedTile, boardState, team)) return true;
                    } else {
                        if (this.tileIsOccupied(passedTile, boardState)) {
                            break;
                        }
                    }
                }
            }
            
        }

        return false;
    }
}
