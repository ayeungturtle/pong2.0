var db = require('knex')({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'pingPong',
      password : 'asdf;lkj',
      database : 'ping_pong1'
    }
});

//  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'asdf;lkj'
//  This query was run in mysql workbench to allow old authentication method for connection.

module.exports = db;