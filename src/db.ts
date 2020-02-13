import { Sequelize } from "sequelize-typescript";
// import { config } from "./config/config";
const config = require("./config/config");

const c = config.development;

const db = new Sequelize({
    "username": c.username,
    "password": c.password,
    "database": c.database,
    "host": c.host,
    "port": parseInt(c.port),
    "protocol": c.protocol,
    dialect: 'postgres',
    storage: ':memory:',
    "logging": false
});

export default db;