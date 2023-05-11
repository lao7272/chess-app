import { Position } from "../../models";
import { tileIsEmptyOrCaptured } from "./General.rules";

const getPossibleKnightMoves = (knight, boardState) => {
    const possibleMoves = [];
    for (let i = -1; i < 2; i += 2) {
        for (let j = -1; j < 2; j += 2) {
            const verticalMove = new Position(knight.position.x + j, knight.position.y + i * 2);
            const horizontalMove = new Position(knight.position.x + i * 2, knight.position.y + j);
            if(verticalMove.x <= 7 && verticalMove.y >= 0 && verticalMove.x >= 0 && verticalMove.y <= 7) {
                if (tileIsEmptyOrCaptured(verticalMove, boardState, knight.team)) {
                    possibleMoves.push(verticalMove);
                }
            } 
            if(horizontalMove.x <= 7 && horizontalMove.y >= 0 && horizontalMove.x >= 0 && horizontalMove.y <= 7) {
                if (tileIsEmptyOrCaptured(horizontalMove, boardState, knight.team)) {
                    possibleMoves.push(horizontalMove);
                }
            }
            
        }
    }
    return possibleMoves;
}

export default getPossibleKnightMoves;