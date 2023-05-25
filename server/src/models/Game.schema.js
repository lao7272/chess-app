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
                    game_id VARCHAR(255),
                    user_one VARCHAR(255),
                    user_two VARCHAR(255),
                    is_full BOOLEAN,
                    game_pieces JSON,
                    move_list JSON,
                    turns INT
            );
            `;
            await this.pool.query(query);
        } catch (err) {
            console.error(err);
        }
    }
}