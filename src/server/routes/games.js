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
        }
        //// Achievements
        // if (req.body.)
        // db('achievements')
        res.status(201).json(resBody)
    })
    .catch((error) => {
        res.status(500).json({ error })
    });
});

module.exports = router;