const express = require ('express');
const router = express.Router();
const db = require ('../db/knex');
const bodyParser = require('body-parser');
router.use(bodyParser.json());  // !!!!! do I need this to be here as well as index.js?

router.post('/api/games', (req, res) => {
    var resBody;
    db('games')
    .insert({
        winnerId: req.body.winnerId,
        loserId: req.body.loserId,
        winnerScore: req.body.winnerScore,
        loserScore: req.body.loserScore,
        lutGameMode: req.body.gameMode
    })
    .then(addedGame => {
        resBody = {   // !!!! can I get these properties from addedGame directly
            winnerId: req.body.winnerId,
            loserId: req.body.loserId,
            winnerScore: req.body.winnerScore,
            loserScore: req.body.loserScore,
            lutGameMode: req.body.gameMode,
            achievements: []
        }

        ///////////////////// Achievements

        const achievementNames = {    // matches lut_achievement_types table
            1: "Winning Spree",
            2: "Winning Frenzy",
            3: "Running Riot",
            4: "Rampage",
            5: "Untouchable",
            6: "Invincible",
            7: "Inconceivable",
            8: "Unfriggenbelievable",
            9: "Whatisgoingon?",
            10: "Pong King",
            11: "Donut",
            12: "King Donut",
            13: "Buzzkill",
            14: "Upset",
            15: "Underdog Hero"
        }

        //////// Streaks

        var streakId = null;
        if ((req.body.winnerStats.streak + 1) % 5 === 0 && req.body.winnerStats.streak < 50)    // add one because another game has been won, <50 because streak awards only go up to 50
            streakId = (req.body.winnerStats.streak + 1) / 5;
        if (streakId !== null) {
            db('achievements')
            .insert({
                playerId: req.body.winnerId,
                lutAchievementTypeId: streakId
            })
            .catch((error) => {
                res.status(500).json({ error })
            });
            resBody.achievements.push({
                playerName: req.body.winnerName,
                achievementName: achievementNames[streakId]     
            })             
        }
        res.status(201).json(resBody);
    })
    .catch((error) => {
        res.status(500).json({ error })
    });
});

module.exports = router;