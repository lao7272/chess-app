import React, { useEffect, useRef, useState } from 'react';
import ChessBoard from '../Chessboard/Chessboard';
import PromotionAlert from '../PromotionAlert/PromotionAlert';
import GameOverAlert from '../GameOverAlert/GameOverAlert';
import MoveList from '../MoveList/MoveList';
import DisplayAxis from '../DisplayAxes/DisplayAxes';
import { initialChessboard } from '../../Constants';
import { Bishop, Knight, Queen, Rook } from '../../models/pieces';
import './Referee.css';

export default function Referee({
    onlineTeam, 
    room, 
    setMove, 
    opponentMove, 
    setGameOverOnline, 
    gameOverOnline, 
    setResign, 
    resign, 
    setDrawOffer,
    setDrawOfferReq,
    setDrawOfferRes,
    drawOfferReq,
    setRematch,
    setRematchReq,
    rematchReq,
    setRematchRes
}) {
    const [chessboard, setChessboard] = useState(initialChessboard.clone());
    const [pawnPromotion, setpawnPromotion] = useState();
    const [moveList, setMoveList] = useState(chessboard.moveList);
    const [turn, setTurn] = useState(onlineTeam || "white");
    const [gameOver, setGameOver] = useState(null);

    const promoteRef = useRef(null);

    useEffect(() => {
        if (chessboard.totalTurns === 1) {
            setMoveList([]);
            chessboard.moveList = [];
        };
        if(onlineTeam) {
            if(chessboard.getCurrentTeam === onlineTeam) chessboard.getPossibleMoves();
        } else {
            chessboard.getPossibleMoves();
        }
    }, []);

    useEffect(() => {
        if(gameOverOnline) {
            setGameOver(gameOverOnline);
            setChessboard(currChessBoard => {
                const clonedChessboard = currChessBoard.clone();
                for (const piece of clonedChessboard.pieces) {
                    piece.possibleMoves = [];
                }
                return clonedChessboard;
            })
            return;
        }
        if(!opponentMove) return
        setChessboard(currChessBoard => {
            const clonedChessboard = currChessBoard.clone();
            clonedChessboard.addOnlineProperties(opponentMove.pieces, opponentMove.moveList, opponentMove.totalTurns, onlineTeam);
            setMoveList(clonedChessboard.moveList);
            const teamPieces = clonedChessboard.pieces.filter(p => p.team !== onlineTeam);
            if(teamPieces.some(p => p.possibleMoves.length > 0)) {
                setGameOverOnline(clonedChessboard.gameOver);
                setGameOver(clonedChessboard.gameOver);
            };
            return clonedChessboard;
        });
    }, [opponentMove, gameOverOnline])
    
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
            moveNotation(
                prevPiecesLen, 
                clonedChessboard.pieces.length, 
                currentPiece, desiredPosition, 
                clonedChessboard, 
                clonedChessboard.check,
                clonedChessboard.gameOver === null ? null : clonedChessboard.gameOver === 'draw' ? "=" : "#"
            );
                // SENDS GAME INFORMATION TO SERVER
                if(onlineTeam) setMove({
                    pieces: clonedChessboard.pieces, 
                    moveList: clonedChessboard.moveList, 
                    totalTurns: clonedChessboard.totalTurns
                });
                // CHECK GAME OVER
                clonedChessboard.check = false;
                if (clonedChessboard.gameOver) setGameOver(clonedChessboard.gameOver);
                return clonedChessboard;
        });
        // PAWN PROMOTION
        checkPawnPromotion(currentPiece, desiredPosition);
        // SETS TEAM TURN
        const nextTurn = onlineTeam ? onlineTeam : turn === 'white' ? 'black' : 'white';
        setTurn(nextTurn);
        setMoveList(chessboard.moveList);
        
    }   
    function moveNotation(prevPiecesLen, currPiecesLength, piece, desiredPosition, chessboard, check, gameOverSymbol) {
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
            castling,
            check,
            gameOverSymbol
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
            if (clonedChessboard.gameOver) setGameOver(clonedChessboard.gameOver);

            return clonedChessboard;
        });
    }

    function setPromotionTeam() {
        if (!pawnPromotion) return "white";
        return pawnPromotion.team === "white" ? "white" : "black";
    }
    
    return (
        <>
            <main className='main-container'>
                <div className='chessboard-container'>
                    <DisplayAxis turn={turn}/>
                    <ChessBoard playMove={playMove} pieces={chessboard.pieces} turn={turn}/>
                    <PromotionAlert setPromotionTeam={setPromotionTeam} promotePawn={promotePawn} promoteRef={promoteRef}/>
                    <GameOverAlert gameOver={gameOver} resign={resign}/>
                </div>
                <MoveList 
                moveList={moveList} 
                chessboard={chessboard} 
                room={room} 
                setChessboard={setChessboard} 
                setGameOver={setGameOver} 
                setMoveList={setMoveList} 
                setTurn={setTurn} 
                onlineTeam={onlineTeam}
                setResign={setResign}
                setDrawOffer={setDrawOffer}
                setDrawOfferReq={setDrawOfferReq}
                drawOfferReq={drawOfferReq}
                setDrawOfferRes={setDrawOfferRes}
                gameOver={gameOver}
                setRematch={setRematch}
                setRematchReq={setRematchReq}
                rematchReq={rematchReq}
                setRematchRes={setRematchRes}
                />
            </main>
        </>
    )
}
