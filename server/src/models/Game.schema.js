import Postgresql from "../database/Database.js";

export default class Game extends Postgresql{
    constructor() {
        super('game');
        this.createTable()
    }
    async createTable() {
        try {
            const query = `
                CREATE TABLE IF NOT EXISTS ${this.table} (
                    id SERIAL PRIMARY KEY,
                    gameId VARCHAR(255),
                    userOne VARCHAR(255),
                    userTwo VARCHAR(255),
                    isFull BOOLEAN,
                    gamePieces JSON,
                    moveList JSON,
                    turns INT
            );
            `;
            await this.pool.query(query);
        } catch (err) {
            console.error(err);
        }
    }
}