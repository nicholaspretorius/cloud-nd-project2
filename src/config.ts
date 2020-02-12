const config = {
    "dev": {
        "username": process.env.DB_USER,
        "password": process.env.DB_PASS,
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOST,
        "port": process.env.DB_PORT,
        "protocol": process.env.DB_PROTOCOL,
        "dialect": "postgres",
    }
}

export default config;