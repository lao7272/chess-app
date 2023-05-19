import Postgresql from "../database/Database";

class User extends Postgresql{
    constructor() {
        super("'user'");
        
    }
}