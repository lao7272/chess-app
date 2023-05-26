import React, { useEffect, useState } from 'react';
import Referee from '../Referee/Referee';
import { useLocation } from 'react-router-dom';


export default function GameOnline({ socket }) {
    const {state} = useLocation();
    const [move, setMove] = useState(null);
    const [opponentMove, setOpponentMove] = useState(null);
    const [gameOverOnline, setGameOverOnline] = useState(null);
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
            setGameOverOnline(gameOver)
        })
    }, [socket]);
    useEffect(() => {
        if(gameOverOnline) {
            socket.emit("game-over", {gameOver: gameOverOnline, room: state.room});
            return;
        }
        if (!move) return
        socket.emit('move', move, state.room);
    }, [move, gameOverOnline]);
    return <Referee onlineTeam={state.team} room={state.room} setMove={setMove} opponentMove={opponentMove} setGameOverOnline={setGameOverOnline} gameOverOnline={gameOverOnline}/>;

}
