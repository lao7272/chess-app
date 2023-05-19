import { Pool } from "pg";
import config from "../config/config.js";
const { DATABASE_PASSWORD } = config;
export default class Postgresql {
    constructor(table) {
        this.pool = new Pool({
            user: 'lao',
            host: 'localhost',
            database: '',
            password: DATABASE_PASSWORD,
            port: 5432,
        });
        this.table = table;
    }

    async create() {

    }
    async getAll() {

    }
    async getById(id) {

    }
    async update(obj) {

    }
    async delete(id) {
        
    }
}