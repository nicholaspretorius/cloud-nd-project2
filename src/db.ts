import { Sequelize } from "sequelize-typescript";
import config from "./config";

const c = config.dev;

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