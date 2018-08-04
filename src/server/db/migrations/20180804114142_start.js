
exports.up = function(knex, Promise) {
    return knex.schema
    .createTable('lut_roles', function(r) {
        r.integer('id').primary().unsigned();
        r.string('role', 50).notNull();
        r.string('notes', 150).nullable().defaultTo(null);
    })
    .createTable('lut_game_modes', function(lgm) {
        lgm.integer('id').primary().unsigned();
        lgm.string('gameMode', 50).notNull();
    })
    .createTable('lut_achievement_types', function(lat) {
        lat.integer('id').primary().unsigned();
        lat.string('achievementType', 50).notNull();
        lat.string('notes', 100).nullable().defaultTo(null);
    })   
    .createTable('players', function(p) {
        p.increments('id').primary();
        p.string('firstName', 50).notNull();
        p.string('lastName', 50).notNull();
        p.string('nickName', 50).nullable().defaultTo(null);
        p.integer('lutRole').unsigned().notNull();
        p.dateTime('dateTimeCreated', 6).nullable().defaultTo(knex.fn.now(6));
        p.foreign('lutRole').references('id').inTable('lut_roles').onDelete('restrict').onUpdate('cascade');
    })
    .createTable('games', function(g) {
        g.increments('id').primary();
        g.integer('winnerId').unsigned().notNull();
        g.integer('loserId').unsigned().notNull();;
        g.integer('winnerScore').nullable().defaultTo(null);
        g.integer('loserScore').nullable().defaultTo(null);
        g.integer('lutGameMode').unsigned().nullable().defaultTo(null);
        g.dateTime('dateTime', 6).nullable().defaultTo(knex.fn.now(6));
        g.string('notes', 50).nullable().defaultTo(null);
        g.foreign('winnerId').references('id').inTable('players').onDelete('restrict').onUpdate('cascade');
        g.foreign('loserId').references('id').inTable('players').onDelete('restrict').onUpdate('cascade');
        g.foreign('lutGameMode').references('id').inTable('lut_game_modes').onDelete('restrict').onUpdate('cascade');
    })
    .createTable('achievements', function(a) {
        a.increments('id').primary();
        a.integer('playerId').unsigned().nullable().defaultTo(null);
        a.integer('lutAchievementTypeId').unsigned().nullable().defaultTo(null);
        a.integer('victimId').unsigned().nullable().defaultTo(null);
        a.integer('gameId').unsigned().nullable().defaultTo(null);
        a.dateTime('dateTime', 6).nullable().defaultTo(knex.fn.now(6));
        a.string('notes', 50).nullable().defaultTo(null);
        a.foreign('playerId').references('id').inTable('players').onDelete('restrict').onUpdate('cascade');
        a.foreign('victimId').references('id').inTable('players').onDelete('restrict').onUpdate('cascade');
        a.foreign('lutAchievementTypeId').references('id').inTable('lut_achievement_types').onDelete('restrict').onUpdate('cascade');
        a.foreign('gameId').references('id').inTable('games').onDelete('restrict').onUpdate('cascade');
    })
};

exports.down = function(knex, Promise) {
    return knex.schema
    .dropTable('achievements')
    .dropTable('games')
    .dropTable('players')
    .dropTable('lut_achievement_types')
    .dropTable('lut_game_modes')
    .dropTable('lut_roles')
};