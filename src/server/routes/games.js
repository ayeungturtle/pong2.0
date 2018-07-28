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
            awards: []
        }

        ///////////////////// Achievements

        //////// Streaks
        var streakAwardId = null;
        if ((req.body.winnerStats.streak + 1) % 5 === 0)    // add one because another game has been won
            streakAwardId = (req.body.winnerStats.streak + 1) / 5;
        if (streakAwardId !== null) {
            db('achievements')
            .insert({
                playerId: req.body.winnerId,
                lutAchievementTypeId: streakAwardId
            })
            .catch((error) => {
                res.status(500).json({ error })
            });
            resBody.awards.push({
                    playerId: req.body.winnerId,
                    lutAchievementTypeId: streakAwardId     
            })             
        }
        res.status(201).json(resBody);
    })
    .catch((error) => {
        res.status(500).json({ error })
    });
});

module.exports = router;