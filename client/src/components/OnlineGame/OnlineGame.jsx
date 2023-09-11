import React, { useEffect, useState } from 'react';
import Referee from '../Referee/Referee';
import { useLocation, useNavigate } from 'react-router-dom';

const initialState = {
    move: null,
    opponentMove: null,
    gameOverOnline: null,
    resign: null,
    drawOffer: null,
    drawOfferReq: null,
    drawOfferRes: null,
    rematch: null,
    rematchReq: null,
    rematchRes: null,
    rematchRoom: null
};

// Set the component properties to their initial stages
export default function GameOnline({ socket }) {
    const { state } = useLocation();
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
    const [rematchRoom, setRematchRoom] = useState(null);
    function resetComponentProperties() {
        setMove(initialState.move);
        setOpponentMove(initialState.opponentMove);
        setGameOverOnline(initialState.gameOverOnline);
        setResign(initialState.resign);
        setDrawOffer(initialState.drawOffer);
        setDrawOfferReq(initialState.drawOfferReq);
        setDrawOfferRes(initialState.drawOfferRes);
        setRematch(initialState.rematch);
        setRematchReq(initialState.rematchReq);
        setRematchRes(initialState.rematchRes);
        setRematchRoom(initialState.rematchRoom);
    };
    useEffect(() => {
        console.log('reconnection')
        socket.on("connect", () => {
            socket.emit("join-room", state.room);
            socket.emit("user-reconnected", state.room);
        });
        socket.on("reconnection-data", (data) => {
            if (!data.pieces || !data.moveList || !data.totalTurns) return;
            setOpponentMove(data);
        });
        if (state.gameData) setOpponentMove(state.gameData);
    }, [socket, state.gameData, state.room]);

    useEffect(() => {
        if (!socket) return;

        const handleOpponentMove = (opponentMove) => {
            setOpponentMove(opponentMove);
        };

        const handleGameOver = (gameOver) => {
            setGameOverOnline(gameOver);
        };

        const handleOpponentResigned = (team) => {
            if (!team) return;
            const resignedTeam = team === 'white' ? 'black' : 'white';
            setGameOverOnline(resignedTeam);
            setResign(true);
        };

        const handleDrawOfferReq = () => {
            setDrawOfferReq(true);
        };

        const handleDrawOfferDeclined = () => {
            setDrawOfferReq(null);
            setDrawOfferRes(null);
        };

        const handleRematchReq = () => {
            setRematchReq(true);
        };

        const handleRematchAccepted = (newRoom) => {
            socket.emit("join-room", newRoom);
        };
        const handleRoomData = ({room}) => {
            setRematchRoom(room);
        }
        socket.on('opponent-move', handleOpponentMove);
        socket.on('game-over', handleGameOver);
        socket.on('opponent-resigned', handleOpponentResigned);
        socket.on('draw-offer-req', handleDrawOfferReq);
        socket.on('draw-offer-declined', handleDrawOfferDeclined);
        socket.on('rematch-req', handleRematchReq);
        socket.on('rematch-accepted', handleRematchAccepted);
        socket.on('room-data', handleRoomData);

        return () => {
            socket.off('opponent-move', handleOpponentMove);
            socket.off('game-over', handleGameOver);
            socket.off('opponent-resigned', handleOpponentResigned);
            socket.off('draw-offer-req', handleDrawOfferReq);
            socket.off('draw-offer-declined', handleDrawOfferDeclined);
            socket.off('rematch-req', handleRematchReq);
            socket.off('rematch-accepted', handleRematchAccepted);
            socket.off('room-data', handleRoomData);
        };

}, [socket]);
useEffect(() => {
    if (gameOverOnline) {
        socket.emit("game-over", { gameOver: gameOverOnline, room: state.room });
        return;
    }
    if (!move) return
    socket.emit('move', move, state.room);
}, [move, gameOverOnline, state.room, socket]);
useEffect(() => {
    if (resign && !gameOverOnline) {
        socket.emit("resign", { room: state.room, team: state.team });
        return;
    }
    if (drawOffer && !gameOverOnline) {
        socket.emit("draw-offer", state.room);
        setDrawOffer(null);
        return;
    }
    if (drawOfferRes && !gameOverOnline) {
        socket.emit("draw-offer-res", { room: state.room, res: drawOfferRes });
        setDrawOfferRes(null);
        return;
    }
    if (rematch && gameOverOnline) {
        socket.emit("rematch-offer", state.room);
        setRematch(null);
        return
    }
    if (rematchRes && gameOverOnline) {
        const team = state.team === "white" ? "black" : "white";
        socket.emit("rematch-res", { room: state.room, team });
        setRematchRes(null);
    }
    if(rematchRoom && gameOverOnline) {
        navigate("/game", {
            state: {
                room: rematchRoom,
                team: state.team === "white" ? "black" : "white",
                rematch: true
            }
        });
        resetComponentProperties();
    }

}, [
    resign, 
    drawOffer, 
    drawOfferRes, 
    rematch, 
    rematchRes, 
    rematchRoom, 
    gameOverOnline, 
    navigate, 
    socket,
    state.room,
    state.team
]);

return (<Referee key={state.room}
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
    state={state}
/>);

}
