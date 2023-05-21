import express from "express";
import { createServer } from "http";
import cors from "cors";
import config from "./src/config/config.js";
import gameServer from "./src/modules/socket.js";

const app = express();
const httpServer = createServer(app);

const { PORT } = config;

gameServer(httpServer);

app.use(cors());

httpServer.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`))
