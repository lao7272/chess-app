import './App.css';
import { Routes, Route } from "react-router-dom";
import Referee from './components/Referee/Referee';
import io from "socket.io-client";
const socket = io.connect("http://localhost:8080")
function App() {
  return (
    <>
      <div className='app'>
        <Referee/>
      </div>
      <Routes>
        <Route path='/game/:id' element={<Referee/>}/>
      </Routes>
    </>
  );
}

export default App;
