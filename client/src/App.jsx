import './App.css';
import { Routes, Route } from "react-router-dom";
import Referee from './components/Referee/Referee';
import io from "socket.io-client";
import Home from './components/Home/Home';
import { useEffect, useState } from 'react';
function App() {
  const [team, setTeam] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io.connect("http://localhost:8080"));
  }, [])
  useEffect(() => {
    if (!socket) return;
    socket.on("room-data", ({room, team}) => {
      console.log(room, team)
      setTeam(team);
    });
  }, [socket]);
  return (
    <>
      <div className='app'>
      <Routes>
        <Route path='/' element={<Home socket={socket}/>}/>
        <Route path='/local-game' element={<Referee/>}/>
        {team && <Route path='/game' element={<Referee onlineTeam={team}/>}/>}
      </Routes>
      </div>
    </>
  );
}

export default App;
