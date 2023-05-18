import './App.css';
import { Routes, Route } from "react-router-dom";
import Referee from './components/Referee/Referee';
import io from "socket.io-client";
import Home from './components/Home/Home';
const socket = io.connect("http://localhost:8080")
function App() {
  return (
    <>
      <div className='app'>
        {/* <Referee socket={socket}/> */}
      <Routes>
        <Route path='/' element={<Home socket={socket}/>}/>
        <Route path='/local-game' element={<Referee/>}/>
        <Route path='/game' element={<Referee socket={socket}/>}/>
      </Routes>
      </div>
    </>
  );
}

export default App;
