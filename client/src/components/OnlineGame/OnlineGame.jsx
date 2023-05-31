import React, { useEffect, useState } from 'react';
import Referee from '../Referee/Referee';
import { useLocation, useNavigate } from 'react-router-dom';
import { initialChessboard } from '../../Constants';


export default function GameOnline({ socket }) {
    const {state} = useLocation();
    const navigate = useNavigate();
    const [move, setMove] = useState(null);
    const [opponentMove, setOpponentMove] = useState(null);
    const [gameOverOnline, setGameOverOnline] = useState(null);
    const [resign, setResign] = useState(null);
    const [drawOffer, setDrawOffer] = useState(null);
    const [drawOfferReq, setDrawOfferReq] = useState(null);
    const [drawOfferRes, setDrawOfferRes] = useState(null);
    const [rematch, setRematch] = useState(null);
    const [rematchReq, setRematchReq] = useState(null);
    const [rematchRes, setRematchRes] = useState(null);
    useEffect(() => {
        socket.on("connect", () => {
            socket.emit("join-room", state.room);
            socket.emit("user-reconnected", state.room);
        });
        socket.on("reconnection-data", (data) => {
            if(!data.pieces || !data.moveList || !data.totalTurns) return;
            setOpponentMove(data);
        });
        if(state.gameData) setOpponentMove(state.gameData);
    }, []);
    
    useEffect(() => { 
        if (!socket) return;
        socket.on('opponent-move', (opponentMove) => {
            setOpponentMove(opponentMove);
        });
        socket.on('game-over', gameOver => {
            setGameOverOnline(gameOver);
        });
        socket.on('opponent-resigned', (team) => {
            if(!team) return;
            const resignedTeam = team === "white" ?  "black" : "white";
            setGameOverOnline(resignedTeam);
            setResign(true);
        });
        socket.on('draw-offer-req', () => {
            setDrawOfferReq(true);
        });
        socket.on("draw-offer-declined", () => {
            setDrawOfferReq(null);
            setDrawOfferRes(null);
        });
        socket.on('rematch-req', () => {
            setRematchReq(true);
        });
        socket.on("rematch-accepted", (room) => {
            const gameData = {
                pieces: initialChessboard.pieces,
                moveList: [],
                totalTurns: 1
            }
            socket.emit("join-room", room)
            setOpponentMove(gameData);
            console.log("rematch accepted", opponentMove);
            navigate("/game", {state: {
                room: room, 
                team: state.team === "white" ? "black" : "white",
            }})
        });
    
        
    }, [socket]);
    useEffect(() => {
        if(gameOverOnline) {
            socket.emit("game-over", {gameOver: gameOverOnline, room: state.room});
            return;
        }
        if (!move) return
        socket.emit('move', move, state.room);
    }, [move, gameOverOnline]);
    useEffect(() => {
        if(resign && !gameOverOnline) {
            socket.emit("resign", {room: state.room, team: state.team});
            return;
        }
        if(drawOffer && !gameOverOnline) {
            socket.emit("draw-offer", state.room);
            setDrawOffer(null);
            return;
        }
        if(drawOfferRes && !gameOverOnline) {
            socket.emit("draw-offer-res", {room: state.room, res: drawOfferRes});
            setDrawOfferRes(null);
            return;
        }
        if(rematch && gameOverOnline) {
            socket.emit("rematch-offer", state.room);
            setRematch(null);
            return
        }
        if(rematchRes && gameOverOnline) {
            const team = state.team === "white" ? "black" : "white";
            socket.emit("rematch-res", {room: state.room, team});
            socket.on('room-data', ({room}) => {            
                const gameData = {
                    pieces: initialChessboard.pieces,
                    moveList: [],
                    totalTurns: 1
                }
                setOpponentMove(gameData);
                console.log(opponentMove)
                navigate("/game", {state: {
                    room: room,
                    team: state.team === "white" ? "black" : "white",
                }});
            });
            setRematchRes(null);
        }
        
    },[resign, drawOffer, drawOfferRes, rematch, rematchRes]);
    return (<Referee 
        onlineTeam={state.team} 
        room={state.room} 
        setMove={setMove} 
        opponentMove={opponentMove} 
        setGameOverOnline={setGameOverOnline} 
        gameOverOnline={gameOverOnline}
        setResign={setResign}
        resign={resign}
        setDrawOffer={setDrawOffer}
        setDrawOfferReq={setDrawOfferReq}
        drawOfferReq={drawOfferReq}
        setDrawOfferRes={setDrawOfferRes}
        setRematch={setRematch}
        setRematchReq={setRematchReq}
        rematchReq={rematchReq}
        setRematchRes={setRematchRes}
    />);

}
