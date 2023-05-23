import express from "express";
import { createServer } from "http";
import cors from "cors";
import config from "./src/config/config.js";
import gameServer from "./src/modules/socket.js";
import Game from "./src/models/Game.schema.js";
const GameDB = new Game();

const app = express();
const httpServer = createServer(app);

const { PORT } = config;

gameServer(httpServer);

app.use(cors());

app.get("/game/:id", async (req, res) => {
    const {id} = req.params;
    const getRoom = await GameDB.read(`WHERE gameId = ${id}`);
    res.json(getRoom);
})

httpServer.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`))
