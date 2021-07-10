const { createPool } = require('mysql');

const { config } = require("dotenv");

config();

const db = createPool({
    host: "localhost",
    user: "root",
    password: "Akashikabuto7",
    database: "db_vehicle"
});

module.exports = { db };