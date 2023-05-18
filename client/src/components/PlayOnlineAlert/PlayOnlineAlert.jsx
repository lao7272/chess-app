import React, { useEffect, useState } from "react";
import "./PlayOnlineAlert.css";
import { Link } from "react-router-dom";
export default function PlayOnlineAlert({generateRoom, joinRoom, socket}) {
    const [inputRoom, setInputRoom] = useState("");
    const [roomExists, setRoomExists]= useState(false);
    useEffect(() => {
        socket.emit("check-room", inputRoom);
        socket.on("room-exists", exists => setRoomExists(exists));
        return () => {
            socket.off('room-exists');
        };
    }, [inputRoom, socket]);
    return (
        <div className="play-alert">
            <Link to={`/game`} onClick={() => generateRoom()} className="play-btn play-btn-hover">Create Room</Link>
            <div className="play-input-container">
                <label htmlFor="room">Join Room</label>
                <input onChange={e => {
                    const value = e.target.value;
                    setInputRoom(value)
                }} type="text" id="room" placeholder="Enter room code"/> 
                { roomExists ? <Link to={`/game`} className="play-btn play-btn-hover" onClick={() => joinRoom(inputRoom)}>Join</Link> : <span className="play-btn play-btn-disabled">Join</span>}
            </div>
        </div>
    )
}