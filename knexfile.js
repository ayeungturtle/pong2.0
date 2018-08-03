// Update with your config settings.

module.exports = {

    development: {
        client: 'mysql',
        version: '8.0',
        connection: {
          database: 'ping_pong1',
          user:     'pingPong',
          password: 'asdf;lkj'
        },
        pool: {
          min: 2,
          max: 10
        },
        migrations: {
          tableName: 'knex_migrations'
        }
    },

    production: {
        client: 'mysql',
        version: '8.0',        
        connection: {
            database: 'ping_pong_production',
            user:     'pingPong',
            password: 'asdf;lkj'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }
};
