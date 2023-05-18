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

    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`)
    })
})

app.use(cors())

httpServer.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`))
