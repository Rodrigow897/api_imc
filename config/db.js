const {Pool} = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'imc',
    password: 'Wcc@2023',
    port: 5432
});

pool.connect()
.then(() => console.log('Server Conected...'))
.catch(err => console.log('Conection failed...'))

module.exports = pool