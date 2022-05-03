const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

//se crea una variable GLOBAL en la que metemos el pool creado y con la que podremos trabajar con promesas
global.db = pool.promise();