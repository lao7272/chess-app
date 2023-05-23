import pg from "pg";
import config from "../config/config.js";
const { Pool } = pg;
const { DATABASE_PASSWORD,DATABASE_HOST, DATABASE_USER, DATABASE_PORT } = config;
export default class Postgresql {
    constructor(table) {
        this.pool = new Pool({
            user: DATABASE_USER,
            host: DATABASE_HOST,
            database: 'postgres',
            password: DATABASE_PASSWORD,
            port: DATABASE_PORT,
        });
        this.table = table;
    }
    
    async create(object) {
        try {
            const columns = Object.keys(object).join(', ');
            const values = Object.values(object);
            const queryString = `INSERT INTO ${this.table} (${columns}) VALUES (${values.map((v, i) => `$${i + 1}`).join(', ')}) RETURNING *;`
            return (await this.pool.query(queryString, values)).rows;
        } catch (err) {
            console.error(`PostgreSQL error ${err}`)
        }
    }
    async read(condition = "") {
        try {
            const query = `SELECT * FROM ${this.table} ${condition}`;
            return (await this.pool.query(query)).rows;
        } catch (err) {
            console.error(`PostgreSQL error ${err}`)
        }
    }
    async update(object, condition) {
        try {
            const columns = Object.keys(object);
            const values = Object.values(object);
            const setString = columns.map((column, i) => `${column} = $${i + 1}`).join(', ');
            const queryString = `UPDATE ${this.table} SET ${setString} ${condition} RETURNING *;`
            return (await this.pool.query(queryString, values)).rows;
        } catch (err) {
            console.error(`PostgreSQL error ${err}`)
        }
    }
    async delete(condition) {
        try {
            const queryString = `DELETE  FROM ${this.table} ${condition}`
            return (await this.pool.query(queryString)).rows;
        } catch (err) {
            console.error(`PostgreSQL error ${err}`)
        }
    }
}

/* 
    {
        gameId: VARCHAR(255),
        userOne: VARCHAR(255),
        userTwo: VARCHAR(255),
        isFull: BOOLEAN,
        team: VARCHAR,
        boardPieces: "JSON",
        moveList: "JSON",
        turns: INT
    }
*/