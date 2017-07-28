const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const {dbUrl} = require('../appConfig');
const db = {};
const sequelize = new Sequelize('postgres', 'postgres', 'example', {
    host: dbUrl,
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});

fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(function (file) {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
