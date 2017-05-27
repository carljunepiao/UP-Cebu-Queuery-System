const Sequelize = require('sequelize');

const connectionUrl = 'postgres://pgdemo:pgdemo@localhost:5432/pgdemo';
const database = new Sequelize(connectionUrl);

module.exports = database;