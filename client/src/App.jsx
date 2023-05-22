import './App.css';
import { Routes, Route } from "react-router-dom";
import Referee from './components/Referee/Referee';
import io from "socket.io-client";
import Home from './components/Home/Home';
import { useEffect, useState } from 'react';
function App() {
  const [team, setTeam] = useState(null);
  const [room, setRoom] = useState(null);
  const [move, setMove] = useState(null);
  const [opponentMove, setOpponentMove] = useState(null);

  const socket = io.connect("http://localhost:8080");
  useEffect(() => {
    if (!socket) return;
    socket.on("room-data", ({room, team}) => {
      setRoom(room);
      setTeam(team);
    });
    socket.on('opponent-move', (opponentMove) => {
      console.log('opponentMove', opponentMove);
      setOpponentMove(opponentMove);
    })
  }, [socket]);
  useEffect(() => {
    socket.emit('move', move);
  }, [move])
  return (
    <>
      <div className='app'>
      <Routes>
        <Route path='/' element={<Home socket={socket}/>}/>
        <Route path='/local-game' element={<Referee/>}/>
        {team && <Route path='/game' element={<Referee onlineTeam={team} room={room} setMove={setMove} opponentMove={opponentMove}/>}/>}
      </Routes>
      </div>
    </>
  );
}

export default App;
