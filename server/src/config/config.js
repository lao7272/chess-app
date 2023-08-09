import "dotenv/config";
const config = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    IO_CLIENT: process.env.IO_CLIENT
}
export default config;