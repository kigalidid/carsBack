const {createPool} = require('mysql')

const {config} = require("dotenv")

config()

const db = createPool({
    host: process.env.HOST_NAME,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME
})

module.exports= {db}