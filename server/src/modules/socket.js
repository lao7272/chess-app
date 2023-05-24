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
            const res = await GameDB.read(`WHERE gameId = '${room}'`);
            const getGame = res[0];
            if(!hasRooms || !getGame) {
                socket.emit('room-success', {success: false, message: "Room does not exit."}); 
                return; 
            }
            const roomSize = rooms.get(room).size;
            if(roomSize === 2) {
                socket.emit('room-success', {success: false, message: "Room is full."}); 
                return;
            }
            
            let game;
            if(!getGame.userone) {
                game = {
                    userOne: socket.id,
                    isFull: true
                }
            } else if (!getGame.usertwo) {
                game = {
                    userTwo: socket.id,
                    isFull: true
                }
            }
            const update = await GameDB.update(game, `WHERE gameId = '${room}'`);
            console.log(update)
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
                const res = await GameDB.read(`WHERE userOne = '${socket.id}' OR userTwo = '${socket.id}'`)
                const room = res[0];
                if(!room) return;
                if(socket.id === room.userone) {
                    await GameDB.update({userone: null}, `WHERE userOne = '${socket.id}'`);
                    console.log("User One Deleted");
                } else if (socket.id === room.userTwo) {
                    await GameDB.update({usertwo: null}, `WHERE userTwo = '${socket.id}'`);
                    console.log("User Two Deleted");
                } else if (!room.userone && !room.usertwo) {
                    await GameDB.delete(`WHERE gameId = '${room}'`);
                    console.log("Game deleted");
                }
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