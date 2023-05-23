import React, { useEffect, useRef, useState } from 'react';
import ChessBoard from '../Chessboard/Chessboard';
import PromotionAlert from '../PromotionAlert/PromotionAlert';
import GameOver from '../GameOver/GameOver';
import MoveList from '../MoveList/MoveList';
import { initialChessboard } from '../../Constants';
import { Bishop, Knight, Queen, Rook } from '../../models/pieces';
import './Referee.css';

export default function Referee({onlineTeam, room, setMove, opponentMove}) {
    const [chessboard, setChessboard] = useState(initialChessboard.clone());
    const [pawnPromotion, setpawnPromotion] = useState();
    const [moveList, setMoveList] = useState(chessboard.moveList);
    const [turn, setTurn] = useState(onlineTeam || "white");

    const promoteRef = useRef(null);
    const checkmateRef = useRef(null);

    useEffect(() => {
        if(onlineTeam) {
            if(chessboard.getCurrentTeam === onlineTeam) chessboard.getPossibleMoves();
        } else {
            chessboard.getPossibleMoves();
        }
    }, []);

    useEffect(() => {
        if(!opponentMove) return
        setChessboard(currChessBoard => {
            const clonedChessboard = currChessBoard.clone();
            clonedChessboard.addOnlineProperties(opponentMove.pieces, opponentMove.moveList, opponentMove.totalTurns, onlineTeam);
            setMoveList(clonedChessboard.moveList)
            return clonedChessboard;
        });
    }, [opponentMove])
    
    function playMove(currentPiece, desiredPosition) {
        if (currentPiece.team === "white" && chessboard.totalTurns % 2 !== 1) return false;
        if (currentPiece.team === "black" && chessboard.totalTurns % 2 !== 0) return false;
        const validMove = currentPiece.possibleMoves.some(move => move.samePosition(desiredPosition));
        if (!validMove) return false;

        // Playmove modifies the board, therefore, the chessboard is updated
        setChessboard(() => {
            const clonedChessboard = chessboard.clone();
            const prevPiecesLen = clonedChessboard.pieces.length;
            clonedChessboard.totalTurns++;
            // MOVE LOGIC
            clonedChessboard.playMove(currentPiece, desiredPosition, validMove); 
            // MOVE NOTATION
            moveNotation(prevPiecesLen, clonedChessboard.pieces.length, currentPiece, desiredPosition, clonedChessboard);
            // CHECK IF IT IS A DRAW
            if (clonedChessboard.winningTeam || clonedChessboard.draw) checkmateRef.current.classList.remove("hidden");
            if(onlineTeam) setMove({
                pieces: clonedChessboard.pieces, 
                moveList: clonedChessboard.moveList, 
                totalTurns: clonedChessboard.totalTurns
            });
            return clonedChessboard;
        });
        // SETS TEAM TURN
        const nextTurn = onlineTeam ? onlineTeam : turn === 'white' ? 'black' : 'white';
        setTurn(nextTurn);
        // PAWN PROMOTION
        checkPawnPromotion(currentPiece, desiredPosition);
        setMoveList(chessboard.moveList);
        
    }   
    function moveNotation(prevPiecesLen, currPiecesLength, piece, desiredPosition, chessboard) {
        const lastMove = chessboard.moveList ? chessboard.moveList[chessboard.moveList.length - 1] : undefined;
        const take = prevPiecesLen > currPiecesLength ? true : false;
        let castling = false;
        if(piece.isKing && (piece.position.x - desiredPosition.x === 2 || piece.position.x - desiredPosition.x === -2)) {
            castling = true;
        }
        const move = {
            type: piece.type, 
            position: desiredPosition, 
            prevPosition: piece.position,
            image: piece.image, 
            take, 
            castling: castling
        };
        
        if(!lastMove || lastMove.length === 2) {
            chessboard.moveList.push([move]);
        } else if(lastMove.length < 2) {
            chessboard.moveList[chessboard.moveList.length - 1].push(move);
        }
    }
    function checkPawnPromotion (piece, desiredPosition ) {
        const promotion = piece.team === "white" ? 7 : 0;

        if (desiredPosition.y === promotion && piece.isPawn) {
            promoteRef.current.classList.remove("hidden");
            setpawnPromotion(prevPromotionPawn => {
                const clonedCurrentPiece = piece.clone()
                clonedCurrentPiece.position = desiredPosition.clone();
                return prevPromotionPawn = clonedCurrentPiece;
            });
        }
    }
    function promotePawn(type) {
        if (!pawnPromotion) return;
        promoteRef.current.classList.add('hidden');
        setChessboard(() => {
            const clonedChessboard = chessboard.clone();
            clonedChessboard.pieces = clonedChessboard.pieces.reduce((result, piece) => {
                if (piece.samePosition(pawnPromotion.position)) { 
                    switch(type) {
                        case "queen":
                            result.push(new Queen(piece.position.clone(), piece.team));
                            break;
                        case "knight":
                            result.push(new Knight(piece.position.clone(), piece.team));
                            break;
                        case "bishop":
                            result.push(new Bishop(piece.position.clone(), piece.team));
                            break;
                        case "rook":
                            result.push(new Rook(piece.position.clone(), piece.team, true));
                            break;
                        default:
                            break;
                    }
                } else {
                    result.push(piece);
                }
                return result;
            }, []);
            clonedChessboard.getPossibleMoves();
            if (clonedChessboard.winningTeam || clonedChessboard.draw) checkmateRef.current.classList.remove("hidden");
            return clonedChessboard;
        });
        chessboard.getPossibleMoves();
    }

    function setPromotionTeam() {
        if (!pawnPromotion) return "white";
        return pawnPromotion.team === "white" ? "white" : "black";
    }
    function restartGame() {
        checkmateRef.current.classList.add("hidden");
        setChessboard(() => {
            const clonedChessboard = initialChessboard.clone();
            initialChessboard.totalTurns = 1;
            initialChessboard.moveList = [];
            setMoveList([]);
            return clonedChessboard;
        });
    }
    return (
        <>
            <main className='main-container'>
                <div className='chessboard-container'>
                    {room && <div className='room'><b>GameId</b>: {room}</div>}
                    <ChessBoard playMove={playMove} pieces={chessboard.pieces} turn={turn}/>
                    <PromotionAlert setPromotionTeam={setPromotionTeam} promotePawn={promotePawn} promoteRef={promoteRef}/>
                    <GameOver winningTeam={chessboard.winningTeam} checkmateRef={checkmateRef} restartGame={restartGame}/>
                </div>
                <MoveList moveList={moveList} chessboard={chessboard}/>
            </main>
        </>
    )
}
