
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


// p.foreign('lut_role').references('id').inTable('lut_roles').onDelete('RESTRICT').onUpdate('CASCADE');        

// g.foreign('winnerId').references('id').inTable('players').onDelete('RESTRICT').onUpdate('CASCADE');
// g.foreign('loserId').references('id').inTable('players').onDelete('RESTRICT').onUpdate('CASCADE');
// g.foreign('lutGameMode').references('id').inTable('lut_game_modes').onDelete('RESTRICT').onUpdate('CASCADE');

// a.foreign('playerId').references('id').inTable('players').onDelete('RESTRICT').onUpdate('CASCADE');
// a.foreign('victimId').references('id').inTable('players').onDelete('RESTRICT').onUpdate('CASCADE');
// a.foreign('lutAchievementTypeId').references('id').inTable('lut_achievement_types').onDelete('RESTRICT').onUpdate('CASCADE');
// a.foreign('gameId').references('id').inTable('games').onDelete('RESTRICT').onUpdate('CASCADE');


// exports.up = function(knex, Promise) {
//     return playersForeignKeys()
//     .then(gamesForeignKeys)
//     .then(createAddressTable)

//     function playersForeignKeys() {
//         return knex.schema.table('players', function(p) {
//             p.foreign('lut_role').references('id').inTable('lut_roles').onDelete('RESTRICT').onUpdate('CASCADE');
//         });
//     }

//     function gamesForeignKeys() {
//         return knex.schema.table('games', function(g) {
//             g.foreign('winnerId').references('id').inTable('players').onDelete('RESTRICT').onUpdate('CASCADE');
//             g.foreign('loserId').references('id').inTable('players').onDelete('RESTRICT').onUpdate('CASCADE');
//             g.foreign('lutGameMode').references('id').inTable('lut_game_modes').onDelete('RESTRICT').onUpdate('CASCADE');
//         });
//     }

//     function achievementsForeignKeys() {
//         return knex.schema.table('achievements', function(g) {
//             a.foreign('playerId').references('id').inTable('players').onDelete('RESTRICT').onUpdate('CASCADE');
//             a.foreign('victimId').references('id').inTable('players').onDelete('RESTRICT').onUpdate('CASCADE');
//             a.foreign('lutAchievementTypeId').references('id').inTable('lut_achievement_types').onDelete('RESTRICT').onUpdate('CASCADE');
//             a.foreign('gameId').references('id').inTable('games').onDelete('RESTRICT').onUpdate('CASCADE');
//         });
//     }
    
// };

// exports.down = function(knex, Promise) {
//     return dropPlayersForeignKeys()
//     .then(dropGamesForeignKeys)
//     .then(dropAchievementsForeignKeys)

//     function dropPlayersForeignKeys() {
//         return knex.schema.table('players', function(p) {
//             p.dropForeign('lut_role');
//         });
//     }

//     function dropGamesForeignKeys() {
//         return knex.schema.table('games', function(g) {
//             g.dropForeign('winnerId');
//             g.dropForeign('loserId');
//             g.dropForeign('lutGameMode');
//         });
//     }

//     function dropAchievementsForeignKeys() {
//         return knex.schema.table('achievements', function(g) {
//             a.dropForeign('playerId');
//             a.dropForeign('victimId');
//             a.dropForeign('lutAchievementTypeId');
//             a.dropForeign('gameId');
//         });
//     }
// };


// ALTER TABLE `ping_pong1`.`players` 
// ADD INDEX `lut_role_idx` (`lut_role` ASC) VISIBLE;
// ;
// ALTER TABLE `ping_pong1`.`players` 
// ADD CONSTRAINT `lut_role`
//   FOREIGN KEY (`lut_role`)
//   REFERENCES `ping_pong1`.`lut_roles` (`id`)
//   ON DELETE NO ACTION
//   ON UPDATE NO ACTION;
