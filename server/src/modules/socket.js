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
                    game_id: room,
                    user_one: socket.id,
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
            const res = await GameDB.read(`WHERE game_id = '${room}'`);
            const getGame = res[0];
            if(!hasRooms || !getGame) return;
            const roomSize = rooms.get(room).size;
            if(roomSize === 2) return;
            
            let game;
            let team = "black"
            if(!getGame.user_one) {
                game = {
                    user_one: socket.id,
                    is_full: true
                }
                team = "white";
            } else if (!getGame.user_two) {
                game = {
                    user_two: socket.id,
                    is_full: true
                }
            }
            await GameDB.update(game, `WHERE game_id = '${room}'`);

            let gameData = null
            if(getGame.turns > 1) {
                gameData = {
                    pieces: getGame.game_pieces || [],
                    moveList: getGame.move_list || [],
                    totalTurns: getGame.turns
                }
            }
            socket.join(room);
            socket.emit("room-data", {room, team: team, gameData: gameData});
            io.to(room).emit("room-status", true);
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
                game_pieces: JSON.stringify(move.pieces),
                move_list: JSON.stringify(move.moveList),
                turns: move.totalTurns
            }
            await GameDB.update(gameUpdate, `WHERE game_id = '${room}'`);
            io.to(room).emit("opponent-move", move);
        });
        socket.on("game-over",  ({gameOver, room}) => {
            io.to(room).emit("game-over", gameOver)
        })

        socket.on("resign", ({room, team}) => {
            io.to(room).emit("opponent-resigned", team);
        })
        socket.on("draw-offer", (room) => {
            io.to(room).emit("")
        })

        socket.on("user-reconnected", async (room) => {
            const res = await GameDB.read(`WHERE game_id = '${room}'`);
            const game = res[0];
            if(!game) return;
            const gameData = {
                pieces: game.game_pieces || [],
                moveList: game.move_list || [],
                totalTurns: game.turns
            }
            io.to(room).emit('reconnection-data', gameData);
        })
        socket.on("disconnect", async () => {
            try {
                console.log(`${socket.id} disconnected`);
                const res = await GameDB.read(`WHERE user_one = '${socket.id}' OR user_two = '${socket.id}'`)
                const room = res[0];
                const emptyRooms = await GameDB.read("WHERE user_one IS NULL AND user_two IS NULL");
                emptyRooms.forEach(room => {
                    GameDB.delete(`WHERE game_id = '${room.game_id}'`);
                })
                if(!room) return;
                if(socket.id === room.user_one) {
                    await GameDB.update({user_one: null, is_full: false}, `WHERE user_one = '${socket.id}'`);
                    console.log("User One Deleted");
                } else if (socket.id === room.user_two) {
                    await GameDB.update({user_two: null, is_full: false}, `WHERE user_two = '${socket.id}'`);
                    console.log("User Two Deleted");
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