export default class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    samePosition({x, y}){
        return x === this.x && y === this.y;
    }
}