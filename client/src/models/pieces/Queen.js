import Piece from "../Piece";
import Position from "../Positition";
import Movement from "./Movement";
const movement = new Movement();
export default class Queen extends Piece {
  constructor(position, team, possibleMoves = []) {
    super(position, team, "queen", possibleMoves);
  }
  getPossibleMoves(pieces) {
    const x = this.position.x;
    const y = this.position.y;

    let upperRight = true;
    let upperLeft = true;
    let bottomRight = true;
    let bottomLeft = true;
    // TOP
    for (let i = 1; i < 8; i++) {
      if (y + i > 7) break;
      let passedTile = new Position(x, y + i);
      if (movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team)) {
        this.possibleMoves.push(passedTile);
      }
      if (movement.tileIsOccupied(passedTile, pieces)) break;
    }
    // BOTTOM
    for (let i = 1; i < 8; i++) {
      if (y - i < 0) break;
      let passedTile = new Position(x, y - i);

      if (movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team)) {
        this.possibleMoves.push(passedTile);
      }
      if (movement.tileIsOccupied(passedTile, pieces)) break;
    }
    // RIGHT
    for (let i = 1; i < 8; i++) {
      if (x + i > 7) break;
      let passedTile = new Position(x + i, y);
      if (movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team)) {
        this.possibleMoves.push(passedTile);
      }
      if (movement.tileIsOccupied(passedTile, pieces)) break;
    }
    // LEFT
    for (let i = 1; i < 8; i++) {
      if (x - i < 0) break;
      let passedTile = new Position(x - i, y);
      if (movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team)) {
        this.possibleMoves.push(passedTile);
      }
      if (movement.tileIsOccupied(passedTile, pieces)) break;
    }
    
    for (let i = 1; i < 8; i++) {
      if (x + i > 7 || y + i > 7) upperRight = false;
      if (x - i < 0 || y + i > 7) upperLeft = false;
      if (x + i > 7 || y - i < 0) bottomRight = false;
      if (x - i < 0 || y - i < 0) bottomLeft = false;

      // UPPER RIGHT
      let passedTile = new Position(x + i, y + i);
      if (
        movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team) &&
        upperRight
      ) {
        this.possibleMoves.push(passedTile);
      }
      if (movement.tileIsOccupied(passedTile, pieces) && upperRight) {
        upperRight = false;
      }

      // UPPER LEFT
      passedTile = new Position(x - i, y + i);
      if (
        movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team) &&
        upperLeft
      ) {
        this.possibleMoves.push(passedTile);
      }
      if (movement.tileIsOccupied(passedTile, pieces) && upperLeft) {
        upperLeft = false;
      }
      // BOTTOM RIGHT
      passedTile = new Position(x + i, y - i);
      if (
        movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team) &&
        bottomRight
      ) {
        this.possibleMoves.push(passedTile);
      }
      if (movement.tileIsOccupied(passedTile, pieces) && bottomRight) {
        bottomRight = false;
      }

      // BOTTOM LEFT
      passedTile = new Position(x - i, y - i);
      if (
        movement.tileIsEmptyOrCaptured(passedTile, pieces, this.team) &&
        bottomLeft
      ) {
        this.possibleMoves.push(passedTile);
      }
      if (movement.tileIsOccupied(passedTile, pieces) && bottomLeft) {
        bottomLeft = false;
      }
    }
    return this.possibleMoves;
  }
  clone() {
    return new Queen(
      this.position.clone(),
      this.team,
      this.possibleMoves.map((move) => move.clone()),
    );
  }
}
