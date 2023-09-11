import "dotenv/config";
const config = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    CLIENT: process.env.CLIENT
}
export default config;