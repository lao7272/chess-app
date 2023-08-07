import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import PlayOnlineAlert from "../PlayOnlineAlert/PlayOnlineAlert";

export default function Home ({socket}) {
    const [playOnline, setPlayOnline] = useState(false);    
    return(
        <div className="home">
            <div>
                <div className="home-title">Chess Game</div>
                <div>
                    <button className="home-link" onClick={() => setPlayOnline(!playOnline)}>Play With Friends</button>
                    <Link className="home-link" to="/local-game">Play Local</Link>
                </div>
            </div>
            
            <PlayOnlineAlert socket={socket} playOnline={playOnline}/>
        </div>
    )
}