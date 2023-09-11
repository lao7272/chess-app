import config from "./config.js";
const { CLIENT } = config;
const corsConfig = {
    origin: CLIENT,
    methods: ["GET", "POST"]
}

export default corsConfig;