"use strict"
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);

const env = process.env.NODE_ENV || "development";
const config = require('../../../config/config_db')[env];
const db = {};
let sequelize;
if (config.use_env_variable) {
    // eslint-disable-next-line no-console
    console.log('config.use_env_variable', true);
    sequelize = new Sequelize(process.env(config.use_env_variable), config);
} else {
    // eslint-disable-next-line no-console
    console.log('config.use_env_variable', false);
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
    );
}

// Paper trail options
const opts = {
    // underscore: true,
    // underscoreAttributes: true
    enableCompression: false,
    enableMigration: false
}

// load papper trail
const PaperTrail = require("sequelize-paper-trail").init(sequelize, opts);
// setup revision change models
PaperTrail.defineModels();

fs.readdirSync(__dirname)
    .filter(file => (
            file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
        )).forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) db[modelName].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;