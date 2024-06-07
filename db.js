const dotenv = require('dotenv');
const { Pool } = require("pg")
dotenv.config()
const host = process.env.dbHost;
const port = process.env.dbPort;
const database = process.env.dbDatabase;
const user = process.env.dbUser;
const password = process.env.dbPassword;
const pool = new Pool({
    host: host,
    port: port,
    database: database,
    user: user,
    password: password,

})
pool.connect((err) => {
    if (err) {
        console.error('connection error', err.stack)
    } else {
        console.log('connected')
    }
})
module.exports = {pool};