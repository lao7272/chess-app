import pg from "pg";
import config from "../config/config.js";
const { Client } = pg;
const { DATABASE_URL } = config;
export default class Postgresql {
    constructor(table) {
        this.client = new Client(DATABASE_URL);
        this.table = table;
        this.connect();
    }
    async connect() {
        this.client.connect((err) => {
            if (err) return console.error('could not connect to postgres', err);
        });
    }
    async create(object) {
        try {
            const columns = Object.keys(object).join(', ');
            const values = Object.values(object);
            const queryString = `INSERT INTO ${this.table} (${columns}) VALUES (${values.map((v, i) => `$${i + 1}`).join(', ')}) RETURNING *;`
            return (await this.client.query(queryString, values)).rows;
        } catch (err) {
            console.error(`PostgreSQL error ${err}`)
        }
    }
    async read(condition = "") {
        try {
            const query = `SELECT * FROM ${this.table} ${condition}`;
            return (await this.client.query(query)).rows;
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
            return (await this.client.query(queryString, values)).rows;
        } catch (err) {
            console.error(`PostgreSQL error ${err}`)
        }
    }
    async delete(condition) {
        try {
            const queryString = `DELETE  FROM ${this.table} ${condition}`
            return (await this.client.query(queryString)).rows;
        } catch (err) {
            console.error(`PostgreSQL error ${err}`)
        }
    }
}

