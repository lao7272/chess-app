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

    io.on("connection", async socket => {
        console.log(`Socket connected. Id: ${socket.id}`);
        const room = await GameDB.read(`WHERE userOne = '${socket.id}' OR userTwo = '${socket.id}'`)
        socket.on("generate-room", async () => {
            try {
                const room = generateRoom();
                const game = {
                    gameId: room,
                    userOne: socket.id,
                }
                await GameDB.create(game);
                socket.join(room);
                socket.emit("room-data", {room, team: "white"});
            } catch (err) {
                console.error(err);
            }
        });
    
        socket.on("join-room", async (room) => {
            const rooms = io.sockets.adapter.rooms;
            const hasRooms = rooms.has(room);
            const getGame = await GameDB.read(`WHERE gameId = '${room}'`)
            if(!hasRooms || !getGame) {
                socket.emit('room-success', {success: false, message: "Room does not exit."}); 
                return; 
            }
            const roomSize = rooms.get(room).size;
            if(roomSize === 2) {
                socket.emit('room-success', {success: false, message: "Room is full."}); 
                return;
            }
            const game = {
                userTwo: socket.id,
                isFull: true
            }
            await GameDB.update(game, `WHERE gameId = '${room}'`);
            socket.join(room);
            socket.emit('room-success', {success: true}); 
            socket.emit("room-data", {room, team: "black"});
        });
        socket.on("check-room", room => {
            const rooms = io.sockets.adapter.rooms;
            if (rooms.has(room) && rooms.get(room).size === 2) {
                socket.emit("room-exists", false);
                return;
            }
            socket.emit("room-exists", rooms.has(room));
        })

        socket.on("move", async (move, room) => {
            const gameUpdate = {
                gamePieces: JSON.stringify(move.pieces),
                moveList: JSON.stringify(move.moveList),
                turns: move.totalTurns
            }
            await GameDB.update(gameUpdate, `WHERE gameId = '${room}'`);
            io.to(room).emit("opponent-move", move);
        });

        socket.on("user-reconnected", async (room) => {
            const res = await GameDB.read(`WHERE gameId = '${room}'`);
            const game = res[0];
            if(!game) return;
            const gameData = {
                pieces: game.gamepieces,
                moveList: game.movelist,
                totalTurns: game.turns
            }
            io.to(room).emit('reconnection-data', gameData);
        })
        socket.on("disconnect", async () => {
            try {
                
                
                console.log(`${socket.id} disconnected`);
                // if (!currRoom) return;
                // if(socket.id === currRoom.userOne) {
                //     await GameDB.update({userOne: null}, `userOne = ${socket.id}`)
                // } else if (socket.id === currRoom.userTwo) {
                //     await GameDB.update({userTwo: null}, `userTwo = ${socket.id}`)
                // } else {

                // }
            } catch (err) {
                console.error(err)
            }
            
        })
    })
}
function generateRoom () {
    return `room-${Date.now()}`;
}

export default gameServer;