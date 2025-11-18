require("dotenv").config();
// eslint-disable-next-line camelcase
const config_db = {
    development: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        dialect: process.env.DB_DIALECT, 
        // Enable logging for development
        // eslint-disable-next-line no-console
        logging: process.env.DB_LOGGING === "1" ? console.log : false,
    },
    staging: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        dialect: process.env.DB_DIALECT,
        // Enable logging for staging
        // eslint-disable-next-line no-console
        logging: process.env.DB_LOGGING === "1" ? console.log : false,
    },
    demo: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        dialect: process.env.DB_DIALECT,
        // Enable logging for demo
        // eslint-disable-next-line no-console
        logging: process.env.DB_LOGGING === "1" ? console.log : false,
    },
    production: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        dialect: process.env.DB_DIALECT,
        // Disable logging for production
        // eslint-disable-next-line no-console
        logging: process.env.DB_LOGGING === "1" ? console.log : false,
    },
}
// eslint-disable-next-line camelcase
module.exports = config_db;