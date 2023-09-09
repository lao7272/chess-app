import React, { useEffect, useRef, useState } from 'react';
import ChessBoard from '../Chessboard/Chessboard';
import PromotionAlert from '../PromotionAlert/PromotionAlert';
import GameOverAlert from '../GameOverAlert/GameOverAlert';
import MoveList from '../MoveList/MoveList';
import DisplayAxis from '../DisplayAxes/DisplayAxes';
import { initialChessboard } from '../../Constants';
import { Bishop, Knight, Queen, Rook } from '../../models/pieces';
import './Referee.css';
import ReturnHome from '../ReturnHome/ReturnHome';

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
    setRematchRes,
    state
}) {
    const [chessboard, setChessboard] = useState(initialChessboard.clone());
    const [currPiece, setCurrPiece] = useState(null);
    const [grabPosition, setGrabPosition] = useState(null);
    const [pawnPromotion, setPawnPromotion] = useState(null);
    const [moveList, setMoveList] = useState(chessboard.moveList);
    const [prevPiecesLen, setPrevPiecesLen] = useState(initialChessboard.pieces.length);
    const [turn, setTurn] = useState(onlineTeam || "white");
    const [check, setCheck] = useState(false);
    const [gameOver, setGameOver] = useState(null);

    const promoteRef = useRef(null);

    useEffect(() => {
        if (chessboard.totalTurns === 1) {
            setMoveList([]);
            chessboard.moveList = [];
        };
        if (onlineTeam) {
            if (chessboard.getCurrentTeam === onlineTeam) chessboard.getPossibleMoves();
        } else {
            chessboard.getPossibleMoves();
        }
    }, []);

    useEffect(() => {
        if (gameOverOnline) {
            setGameOver(gameOverOnline);
            setChessboard(currChessBoard => {
                const clonedChessboard = currChessBoard.clone();
                for (const piece of clonedChessboard.pieces) {
                    piece.possibleMoves = [];
                }
                return clonedChessboard;
            });
            return;

        }
        if (!opponentMove) return
        setChessboard(currChessBoard => {
            const clonedChessboard = currChessBoard.clone();
            clonedChessboard.addOnlineProperties(opponentMove.pieces, opponentMove.moveList, opponentMove.totalTurns, onlineTeam);
            setMoveList(clonedChessboard.moveList);
            const teamPieces = clonedChessboard.pieces.filter(p => p.team !== onlineTeam);
            if (teamPieces.some(p => p.possibleMoves.length > 0)) {
                setGameOverOnline(clonedChessboard.gameOver);
                setGameOver(clonedChessboard.gameOver);
            };
            return clonedChessboard;
        });
    }, [opponentMove, gameOverOnline]);
    useEffect(() => {
        if (!state || !state.rematch) return;
        setGameOver(null);
        setTurn(onlineTeam);
        setChessboard(() => {
            const clonedChessboard = initialChessboard.clone();
            initialChessboard.totalTurns = 1;
            initialChessboard.moveList = [];
            setMoveList([]);
            clonedChessboard.getPossibleMoves();
            return clonedChessboard;
        });
        return;
    }, [state]);
    useEffect(() => {
        if(chessboard.totalTurns === 1) return;
        if(!currPiece) return;
        // PAWN PROMOTION
        const isPromoting = checkPawnPromotion(currPiece, grabPosition);
        if(isPromoting) return;
        // MOVE NOTATION
        moveNotation(
            prevPiecesLen,
            chessboard.pieces.length,
            currPiece, 
            grabPosition,
            chessboard,
            pawnPromotion,
            check,
            chessboard.gameOver === null ? null : chessboard.gameOver === 'draw' ? "=" : "#"
        );
        // SETS TEAM TURN
        const nextTurn = onlineTeam ? onlineTeam : turn === 'white' ? 'black' : 'white';
        setTurn(nextTurn);
        setMoveList(chessboard.moveList);
        setCheck(false);
        setPawnPromotion(false);
        if (chessboard.gameOver) setGameOver(chessboard.gameOver);
        // SENDS GAME INFORMATION TO SERVER
        if(room) setMove({
            pieces: chessboard.pieces,
            totalTurns: chessboard.totalTurns,
            moveList: chessboard.moveList
        })
        setCurrPiece(null);
    }, [chessboard]);
    function playMove(currentPiece, desiredPosition) {
        if (currentPiece.team === "white" && chessboard.totalTurns % 2 !== 1) return false;
        if (currentPiece.team === "black" && chessboard.totalTurns % 2 !== 0) return false;
        const validMove = currentPiece.possibleMoves.some(move => move.samePosition(desiredPosition));
        if (!validMove) return false;

        // Playmove modifies the board, therefore, the chessboard is updated
        setChessboard(() => {
            const clonedChessboard = chessboard.clone();
            setPrevPiecesLen(clonedChessboard.pieces.length);
            clonedChessboard.totalTurns++;
            // MOVE LOGIC
            clonedChessboard.playMove(currentPiece, desiredPosition, validMove);
            setCurrPiece(currentPiece);
            setGrabPosition(desiredPosition);
            setCheck(clonedChessboard.check);
            clonedChessboard.check = false;            
            return clonedChessboard;
        });

        

    }
    function moveNotation(prevPiecesLen, currPiecesLength, piece, desiredPosition, chessboard, isPromotion, check, gameOverSymbol) {
        const lastMove = chessboard.moveList ? chessboard.moveList[chessboard.moveList.length - 1] : undefined;
        const take = prevPiecesLen > currPiecesLength ? true : false;
        let castling = false;
        const promotion = isPromotion ? true : false;
        if (piece.isKing && (piece.position.x - desiredPosition.x === 2 || piece.position.x - desiredPosition.x === -2)) {
            castling = true;
        }
        const move = {
            type: piece.type,
            position: desiredPosition,
            prevPosition: piece.position,
            image: piece.image,
            take,
            castling,
            promotion, 
            check,
            gameOverSymbol
        };

        if (!lastMove || lastMove.length === 2) {
            chessboard.moveList.push([move]);
        } else if (lastMove.length < 2) {
            chessboard.moveList[chessboard.moveList.length - 1].push(move);
        }
    }
    function checkPawnPromotion(piece, desiredPosition) {
        if(!piece) return false;
        const promotion = piece.team === "white" ? 7 : 0;

        if (desiredPosition.y === promotion && piece.isPawn){
            promoteRef.current.classList.remove("hidden");
            promoteRef.current.classList.add("show");
            setPawnPromotion(prevPromotionPawn => {
                const clonedCurrentPiece = piece.clone()
                clonedCurrentPiece.position = desiredPosition.clone();
                return prevPromotionPawn = clonedCurrentPiece;
            });
            return true;
        }
        return false;
    }
    function promotePawn(type) {
        if (!pawnPromotion) return;
        promoteRef.current.classList.add('hidden');
        promoteRef.current.classList.remove("show");
        setChessboard(() => {
            const clonedChessboard = chessboard.clone();
            clonedChessboard.pieces = clonedChessboard.pieces.reduce((result, piece) => {
                if (piece.samePosition(pawnPromotion.position)) {
                    let newPiece;
                    switch (type) {
                        case "queen":
                            newPiece = new Queen(piece.position.clone(), piece.team);
                            result.push(newPiece);
                            setCurrPiece(newPiece);
                            break;
                        case "knight":
                            newPiece = new Knight(piece.position.clone(), piece.team);
                            result.push(newPiece);
                            setCurrPiece(newPiece);
                            break;
                        case "bishop":
                            newPiece = new Bishop(piece.position.clone(), piece.team);
                            result.push(newPiece);
                            setCurrPiece(newPiece)
                            break;
                        case "rook":
                            newPiece = new Rook(piece.position.clone(), piece.team, true);
                            result.push(newPiece);
                            setCurrPiece(newPiece);
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
                <ReturnHome/>

                <div className="chessboard-container">
                    <div className='chessboard-wrapper'>
                        <DisplayAxis turn={turn} />
                        <ChessBoard playMove={playMove} pieces={chessboard.pieces} turn={turn} />
                        <PromotionAlert setPromotionTeam={setPromotionTeam} promotePawn={promotePawn} promoteRef={promoteRef} />
                        <GameOverAlert gameOver={gameOver} resign={resign} />
                    </div>
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
