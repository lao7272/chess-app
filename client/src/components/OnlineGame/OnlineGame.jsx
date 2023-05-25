import React, { useEffect, useState } from 'react';
import Referee from '../Referee/Referee';
import { useLocation } from 'react-router-dom';


export default function GameOnline({ socket }) {
    const {state} = useLocation();
    const [move, setMove] = useState(null);
    const [opponentMove, setOpponentMove] = useState(null);
    useEffect(() => {
        socket.on("connect", () => {
            socket.emit("join-room", state.room);
            socket.emit("user-reconnected", state.room);
        });
        socket.on("reconnection-data", (data) => {
            if(data.pieces === undefined || data.moveList === undefined || data.totalTurns === undefined ) return;
            setOpponentMove(data);
        });
    }, []);
    
    useEffect(() => {        
        if (!socket) return;
        socket.on('opponent-move', (opponentMove) => {
            setOpponentMove(opponentMove);
        });

    }, [socket]);
    useEffect(() => {
        if (!move) return
        socket.emit('move', move, state.room);
    }, [move]);
    return <Referee onlineTeam={state.team} room={state.room} setMove={setMove} opponentMove={opponentMove} />;

}
