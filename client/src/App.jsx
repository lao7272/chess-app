import './App.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Root from './components/Root/Root';
import Referee from './components/Referee/Referee';
import Home from './components/Home/Home';
import io from "socket.io-client";
import OnlineGame from './components/OnlineGame/OnlineGame';
function App() {
  const socket = io.connect(process.env.REACT_APP_SERVER);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Root/>}>
        <Route path='/' index element={<Home socket={socket}/>}/>
        <Route path='/local-game' element={<Referee/>}/>
        <Route path='/game' element={<OnlineGame socket={socket}/>}/>
      </Route>
    )
  ) 
  return (
    <>
      <div className='app'>
        <RouterProvider router={router}/>
      </div>
    </>
  );
}

export default App;
