import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css"
import PlayOnlineAlert from "../PlayOnlineAlert/PlayOnlineAlert";

export default function Home ({socket}) {
    const [playOnline, setPlayOnline] = useState(false);

    async function generateRoom() {
        socket.emit("generate-room");
        socket.on("room-id", room => {
            console.log(room);
        });
    }
    function joinRoom(room) {
        if(room === "") return;
        socket.emit("join-room", room);
    }
    
    return(
        <>
            <div>
                <div className="home-title">Chess Game</div>
                <div>
                    <button className="home-link" onClick={() => setPlayOnline(true)}>Play With Friends</button>
                    <Link className="home-link" to={"/local-game"}>Play Local</Link>
                </div>
            </div>
            {
                playOnline && <PlayOnlineAlert generateRoom={generateRoom} joinRoom={joinRoom} socket={socket}/>
            }
            
        </>
    )
}