import { Server } from "socket.io";
import Game from "../models/Game.schema.js";
const GameDB = new Game();
function gameServer (server) {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", socket => {
        console.log(`Socket connected. Id: ${socket.id}`);

        socket.on("generate-room", async () => {
            try {
                const room = generateRoom();
                // const game = {
                //     gameId: room,
                //     userOne: socket.id,
                //     isFull: false,
                //     gamePieces: JSON.stringify(gamePieces),
                //     moveList: JSON.stringify(moveList),
                //     turns
                // }
                // await GameDB.create(game);
                socket.join(room);
                socket.emit("room-data", {room, team: "white"});
            } catch (err) {
                console.error(err);
            }
        });
    
        socket.on("join-room", async (room) => {
            const rooms = io.sockets.adapter.rooms;
            const hasRooms = rooms.has(room);
            //const getGame = await GameDB.read(`WHERE gameId = ${room}`)
            if(!hasRooms) {
                socket.emit('room-error', {success: false, message: "Room does not exit."}); 
                return; 
            }
            const roomSize = rooms.get(room).size;
            if(roomSize === 2) {
                socket.emit('room-error', {success: false, message: "Room is already full."}); 
                return;
            }
            // const game = {
            //     userTwo: socket.id,
            //     isFull: true
            // }
            // await GameDB.update(game, `WHERE gameId = ${getGame.gameId}`);
            socket.join(room);

            socket.emit("room-data", {room, team: "black"});
        });
        socket.on("check-room", room => {
            const rooms = io.sockets.adapter.rooms;
            if(rooms.has(room)) {
                if (rooms.get(room).size === 2) {
                    socket.emit("room-exists", false);
                    return;
                }
            }
            socket.emit("room-exists", rooms.has(room));
        })

        socket.on("move", (chessboard) => {
            socket.broadcast.emit("opponent-move", chessboard);
        });
        socket.on("disconnect", () => {

            if(socket.id) {

            } else if(socket.id) {

            }
            console.log(`${socket.id} disconnected`);
        })
    })
}
function generateRoom () {
    return `room-${Date.now()}`;
}

export default gameServer;