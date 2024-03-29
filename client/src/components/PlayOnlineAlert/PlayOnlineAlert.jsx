import React, { useEffect, useState, useRef } from "react";
import "./PlayOnlineAlert.css";
import { useNavigate } from "react-router-dom";
export default function PlayOnlineAlert({socket, playOnline}) {
    const [inputRoom, setInputRoom] = useState("");
    const [roomExists, setRoomExists]= useState(false);
    const [room, setRoom] = useState(null);
    const [team, setTeam] = useState(null);
    const [gameData, setGameData] = useState(null);
    const navigate = useNavigate();
    const containerRef = useRef(null)
    useEffect(() => {
        socket.emit("check-room", inputRoom);
        socket.on("room-exists", exists => setRoomExists(exists));
        return () => {
            socket.off('room-exists');
        };
    }, [inputRoom, socket]);
    useEffect(() => {
        if(room) {
            navigate(`/game`, {state: {
                room: room,
                team: team,
                gameData: gameData
            }});
        }
    }, [room, gameData, navigate, team]);
    useEffect(() => {
        if(!containerRef.current) return;
        if(playOnline) {
            containerRef.current.classList.add("show");
            containerRef.current.classList.remove("hidden");
        } else { 
            containerRef.current.classList.add("hidden");
            containerRef.current.classList.remove("show");
        }
    }, [playOnline]);
    function generateRoom() {
        socket.emit("generate-room");
        socket.on('room-data', ({room}) => {
            setTeam("white");
            setRoom(room);
        });
    }
    function joinRoom(room) {
        if(room === "") return;
        socket.emit("join-room", room);
        socket.on('room-data', ({room, team, gameData}) => {
            setTeam(team);
            setRoom(room);
            setGameData(gameData);
        });
    }
    return (
        <div ref={containerRef} className="play-alert hidden">
            <button  onClick={() => generateRoom()} className="play-btn play-btn-hover">Create Room</button>
            <div className="play-input-container">
                <label htmlFor="room">Join Room</label>
                <input onChange={e => {
                    const value = e.target.value;
                    setInputRoom(value.trim())
                }} type="text" id="room" placeholder="Enter room code"/> 
                { roomExists ? <button className="play-btn play-btn-hover" onClick={() => joinRoom(inputRoom)}>Join</button> : <button className="play-btn play-btn-disabled">Join</button>}
            </div>
        </div>
    )
}