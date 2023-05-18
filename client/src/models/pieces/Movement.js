export default class Movement {
    tileIsOccupied (currentPosition, boardState) {
        const piece = boardState.find(p => p.samePosition(currentPosition));
        if (piece) return true;
        return false;
    }
    pieceIsCaptured(currentPosition, boardState, team) {
        const piece = boardState.find(p => p.samePosition(currentPosition) && p.team !== team);
        if (piece) return true;
        return false;
    }
    tileIsEmptyOrCaptured (currentPosition, boardState, team) {
        return (!this.tileIsOccupied(currentPosition, boardState) || this.pieceIsCaptured(currentPosition, boardState, team));
    }
}