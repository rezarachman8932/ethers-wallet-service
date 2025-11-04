require("dotenv").config();
const config_db = {
    development: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        dialect: process.env.DB_DIALECT,
        logging: process.env.DB_LOGGING == 1 ? console.log : false,
    },
    staging: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        dialect: process.env.DB_DIALECT,
        logging: process.env.DB_LOGGING == 1 ? console.log : false,
    },
    demo: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        dialect: process.env.DB_DIALECT,
        logging: process.env.DB_LOGGING == 1 ? console.log : false,
    },
    production: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        dialect: process.env.DB_DIALECT,
        logging: process.env.DB_LOGGING == 1 ? console.log : false,
    },
}

module.exports = config_db;