exports.seed = function(knex, Promise) {
// Deletes ALL existing entries
return knex('lut_roles').del()
    .then(function () {
    // Inserts seed entries
        return knex('lut_roles').insert([
            {id: 0, role: 'Inactive'}, 
            {id: 1, role: 'Player'}, 
            {id: 2, role: 'Gambler'}, 
            {id: 3, role: 'Player/Gambler'}, 
            {id: 4, role: 'Administrator'}
        ]);
    })
    .then(function () {
        return knex('lut_game_modes').del()
    })
    .then(function () {
        // Inserts seed entries
        return knex('lut_game_modes').insert([
            {id: 0, gameMode: 'Tournament'}, 
            {id: 1, gameMode: 'Ping King'}, 
            {id: 2, gameMode: 'Random Robin'}
        ]);
    })
    .then(function () {
        return knex('lut_achievement_types').del()
    })
    .then(function () {
        // Inserts seed entries
        return knex('lut_achievement_types').insert([
            {id: 0, achievementType: 'Mystery Achievement', notes: null}, 
            {id: 1, achievementType: 'Winning Spree', notes: '5 win streak'}, 
            {id: 2, achievementType: 'Winning Frenzy', notes: '10 win streak'}, 
            {id: 3, achievementType: 'Running Riot', notes: '15 win streak'}, 
            {id: 4, achievementType: 'Rampage', notes: '20 win streak'}, 
            {id: 5, achievementType: 'Untouchable', notes: '25 win streak'}, 
            {id: 6, achievementType: 'Invincible', notes: '30 win streak'}, 
            {id: 7, achievementType: 'Inconceivable', notes: '35 win streak'}, 
            {id: 8, achievementType: 'Unfriggenbelievable', notes: '40 win streak'}, 
            {id: 9, achievementType: 'Whatisgoingon?', notes: '45 win streak'}, 
            {id: 10, achievementType: 'Pong King', notes: '50 win streak'}, 
            {id: 11, achievementType: 'Donut', notes: '5 - 0 win'}, 
            {id: 12, achievementType: 'Mega Donut', notes: '10 - 0 win'}, 
            {id: 13, achievementType: 'Buzzkill', notes: 'ending opponents streak'}, 
            {id: 14, achievementType: 'Upset', notes: 'win with <= 33% win probability'}, 
            {id: 15, achievementType: 'Underdog Hero', notes: 'win with <= 15% win probability'}, 
        ]);
    });
};
