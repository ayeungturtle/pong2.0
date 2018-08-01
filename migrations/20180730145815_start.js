
exports.up = function(knex, Promise) {
    return knex.schema
    .createTable('lut_roles', function(r) {
        r.integer('id').primary();
        r.string('role', 50).notNull();
        r.string('notes', 150).nullable().defaultTo(null);
    })
    .createTable('lut_game_modes', function(lgm) {
        lgm.integer('id').primary();
        lgm.string('gameMode', 50).notNull();
    })
    .createTable('lut_achievement_types', function(lat) {
        lat.integer('id').primary();
        lat.string('achievementType', 50).notNull();
        lat.string('notes', 100).nullable().defaultTo(null);
    })   
    .createTable('players', function(p) {
        p.increments('id').primary();
        p.string('firstName', 50).notNull();
        p.string('lastName', 50).notNull();
        p.string('nickName', 50).nullable().defaultTo(null);
        p.integer('lut_role').notNull();
        p.dateTime('dateTimeCreated', 6).nullable().defaultTo(knex.fn.now(6));
        p.foreign('lut_role').unsigned().references('id').inTable('lut_roles').onDelete('restrict').onUpdate('cascade');        
    })
    .createTable('games', function(g) {
        g.increments('id').primary();
        g.integer('winnerId').notNull();
        g.integer('loserId').notNull();
        g.integer('winnerScore').nullable().defaultTo(null);
        g.integer('loserScore').nullable().defaultTo(null);
        g.integer('lutGameMode').nullable().defaultTo(null);
        g.dateTime('dateTime', 6).nullable().defaultTo(knex.fn.now(6));
        g.string('notes', 50).nullable().defaultTo(null);
        g.foreign('winnerId').unsigned().references('id').inTable('players').onDelete('restrict').onUpdate('cascade');
        g.foreign('loserId').unsigned().references('id').inTable('players').onDelete('restrict').onUpdate('cascade');
        g.foreign('lutGameMode').unsigned().references('id').inTable('lut_game_modes').onDelete('restrict').onUpdate('cascade');
    })
    .createTable('achievements', function(a) {
        a.increments('id').primary();
        a.integer('playerId').nullable().defaultTo(null);
        a.integer('lutAchievementTypeId').nullable().defaultTo(null);
        a.integer('victimId').nullable().defaultTo(null);
        a.integer('gameId').nullable().defaultTo(null);
        a.dateTime('dateTime', 6).nullable().defaultTo(knex.fn.now(6));
        a.string('notes', 50).nullable().defaultTo(null);
        a.foreign('playerId').unsigned().references('id').inTable('players').onDelete('restrict').onUpdate('cascade');
        a.foreign('victimId').unsigned().references('id').inTable('players').onDelete('restrict').onUpdate('cascade');
        a.foreign('lutAchievementTypeId').unsigned().references('id').inTable('lut_achievement_types').onDelete('restrict').onUpdate('cascade');
        a.foreign('gameId').unsigned().references('id').inTable('games').onDelete('restrict').onUpdate('cascade');
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

//needs to go in seed script

// .then(() => {
//     knex('lut_roles').insert([
//         {id: 0, role: 'Inactive'}, 
//         {id: 1, role: 'Player'}, 
//         {id: 2, role: 'Gambler'}, 
//         {id: 3, role: 'Player/Gambler'}, 
//         {id: 4, role: 'Administrator'}
//     ])
// })
// .then(() => {
//     knex('lut_game_modes').insert([
//         {id: 0, gameMode: 'Tournament'}, 
//         {id: 1, gameMode: 'Ping King'}, 
//         {id: 2, gameMode: 'Random Robin'}
//     ])
// })
// .then(() => {
//     knex('lut_achievement_types').insert([
//         {id: 0, achievementType: 'Myster Achievement', notes: null}, 
//         {id: 1, achievementType: 'Winning Spree', notes: '5 win streak'}, 
//         {id: 2, achievementType: 'Winning Frenzy', notes: '10 win streak'}, 
//         {id: 3, achievementType: 'Running Riot', notes: '15 win streak'}, 
//         {id: 4, achievementType: 'Rampage', notes: '20 win streak'}, 
//         {id: 5, achievementType: 'Untouchable', notes: '25 win streak'}, 
//         {id: 6, achievementType: 'Invincible', notes: '30 win streak'}, 
//         {id: 7, achievementType: 'Inconceivable', notes: '35 win streak'}, 
//         {id: 8, achievementType: 'Unfriggenbelievable', notes: '40 win streak'}, 
//         {id: 9, achievementType: 'Whatisgoingon?', notes: '45 win streak'}, 
//         {id: 10, achievementType: 'Pong King', notes: '50 win streak'}, 
//         {id: 11, achievementType: 'Donut', notes: '5 - 0 win'}, 
//         {id: 12, achievementType: 'Mega Donut', notes: '10 - 0 win'}, 
//         {id: 13, achievementType: 'Buzzkill', notes: 'ending opponents streak'}, 
//         {id: 14, achievementType: 'Upset', notes: 'win with <= 33% win probability'}, 
//         {id: 15, achievementType: 'Underdog Hero', notes: 'win with <= 15% win probability'}, 
//     ])
// })