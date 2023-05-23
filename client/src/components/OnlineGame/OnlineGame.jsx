import React, { useEffect, useState } from 'react';
import Referee from '../Referee/Referee';
import { useLocation } from 'react-router-dom';


export default function GameOnline({ socket }) {
    const {state} = useLocation();
    const [move, setMove] = useState(null);
    const [isConnected, setIsConnected] = useState(true);
    const [opponentMove, setOpponentMove] = useState(null);
    useEffect(() => {        
        if (!socket) return;
        socket.on('opponent-move', (opponentMove) => {
            console.log('opponentMove', opponentMove);
            setOpponentMove(opponentMove);
        });
        if (!isConnected) {
            socket.on("connect", () => {
                socket.emit("join-room", state.room);
            });
        }

        socket.on("disconnect", () => {
            setIsConnected(false);
        });
    }, [socket]);
    useEffect(() => {
        socket.emit('move', move, state.room);
    }, [move]);
    return <Referee onlineTeam={state.team} room={state.room} setMove={setMove} opponentMove={opponentMove} />;

}
