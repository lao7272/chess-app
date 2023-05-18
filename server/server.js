import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const httpServer = createServer(app);

const PORT = 8080;


const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", socket => {
    console.log(`Socket connected. Id: ${socket.id}`);

    socket.on("generate-room", () => {
        const room = generateRoom();
        socket.join(room);
        socket.emit("room-id", room);
    });

    socket.on("join-room", (room) => {
        const rooms = io.sockets.adapter.rooms;
        const hasRooms = rooms.has(room);
        if(!hasRooms) {
            socket.emit('room-error', {success: false, message: "Room does not exit."}); 
            return; 
        }
        const roomSize = rooms.get(room).size;
        if(roomSize === 2) {
            socket.emit('room-error', {success: false, message: "Room is already full."}); 
            return;
        }
        socket.join(room);

    });
    socket.on("check-room", room => {
        console.log(io.sockets.adapter.rooms)
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
        console.log(`${socket.id} disconnected`)
    })
})
function generateRoom () {
    return `room-${Date.now()}`;
}

app.use(cors());

httpServer.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`))
