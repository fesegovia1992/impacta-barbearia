const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'trybe', // substitua pelo seu usuário do MySQL
    password: 'pa7ducy5', // substitua pela sua senha do MySQL
    database: 'barbearia'
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados MySQL');
    }
});

module.exports = connection;