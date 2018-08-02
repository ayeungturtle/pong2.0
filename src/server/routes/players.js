const express = require ('express');
const router = express.Router();
const db = require ('../db/knex');
const bodyParser = require('body-parser');
router.use(bodyParser.json());  // !!!!! do I need this to be here as well as index.js?

router.get('/api/players', (req, res) => {
    db('players')
    .select()
    .orderBy('firstName')
    .then(allPlayers => {
        res.status(200).json(allPlayers)
    })
    .catch((error) => {
        res.status(500).json({ error });
    });
});

router.get('/api/players/:id', (req, res) => {
    db('players')
    .where({
        id: req.params.id
    })
    .select()
    .then(matchingPlayer => {
        if (matchingPlayer.length === 0)
            res.status(404).json({error:"No matching player found."})
        else
            res.status(200).json(matchingPlayer)
    })
    .catch((error) => {
        res.status(500).json({ error });
    });
});

router.post('/api/players', (req, res) => {
    db('players')
    .insert({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nickName: req.body.nickName,
        lutRole: req.body.lutRole
    })
    .then(addedPlayer => {
        res.status(201).json({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nickName: req.body.nickName,
            lut_role: req.body.lutRole            
        })
    })
    .catch((error) => {
        res.status(500).json({ error });
    });
});

router.get('/api/players/stats/:id1/:id2', (req, res) => {
    var stats = {
        player1: {
            totalWins: null,
            totalLosses: null,
            h2hWins: null,
            winProbability: null,
            streak: null
        },
        player2: {
            totalWins: null,
            totalLosses: null,
            h2hWins: null,
            winProbability: null,
            streak: null
        }  
    };
    var totalWinPercentage1 = .5;
    var totalWinPercentage2 = .5;
    var h2hWinPercentage1 = .5;
    var h2hWinPercentage2 = .5;

    db('games').where({ winnerId: req.params.id1 }).count({ count: '*' }).first()
    .then(p1TotalWins => {
        stats.player1.totalWins = p1TotalWins.count;
        db('games').where({ winnerId: req.params.id2 }).count({ count: '*' }).first()
        .then(p2TotalWins => {
            stats.player2.totalWins = p2TotalWins.count;    
            db('games').where({ loserId: req.params.id1 }).count({ count: '*' }).first()
            .then(p1TotalLosses => {
                stats.player1.totalLosses = p1TotalLosses.count;
                db('games').where({ loserId: req.params.id2 }).count({ count: '*' }).first()
                .then(p2TotalLosses => {
                    stats.player2.totalLosses = p2TotalLosses.count;
                    db('games').where({ winnerId: req.params.id1, loserId: req.params.id2 }).count({ count: '*' }).first()
                    .then(p1h2hWins => {
                        stats.player1.h2hWins = p1h2hWins.count;
                        db('games').where({ winnerId: req.params.id2, loserId: req.params.id1 }).count({ count: '*' }).first()
                        .then(p2h2hWins => {
                            stats.player2.h2hWins = p2h2hWins.count;
                            if (p1TotalWins.count != 0 || p1TotalLosses.count != 0)
                                totalWinPercentage1 = p1TotalWins.count / (p1TotalWins.count + p1TotalLosses.count);
                            if (p2TotalWins.count != 0 || p2TotalLosses.count != 0)                            
                                totalWinPercentage2 = p2TotalWins.count / (p2TotalWins.count + p2TotalLosses.count);
                            if (p1h2hWins.count != 0 || p2h2hWins.count != 0) {
                                h2hWinPercentage1 = p1h2hWins.count / (p1h2hWins.count + p2h2hWins.count);
                                h2hWinPercentage2 = 1.0 - h2hWinPercentage1;
                            }
                            const averageWinPercentage1 = (totalWinPercentage1 + h2hWinPercentage1) / 2.0;
                            const averageWinPercentage2 = (totalWinPercentage2 + h2hWinPercentage2) / 2.0;
                            const winCompare1 = averageWinPercentage1 / averageWinPercentage2;
                            const winCompare2 = averageWinPercentage2 / averageWinPercentage1;
                            const winProbability1 = 1 / ( 1 + (1 / winCompare1));
                            const winProbability2 = 1 / ( 1 + (1 / winCompare2));
                            stats.player1.winProbability = winProbability1;
                            stats.player2.winProbability = winProbability2;
                            db('games').where({ loserId: req.params.id1 }).orderBy('id', 'desc').first()
                            .then(p1LastLoss => {
                                db('games').where('winnerId', req.params.id1).andWhere('id', '>', p1LastLoss.id).count({ count: '*' }).first()
                                .then(p1Streak => {
                                    stats.player1.streak = p1Streak.count;
                                    db('games').where({ loserId: req.params.id2 }).orderBy('id', 'desc').first()
                                    .then(p2LastLoss => {
                                        db('games').where('winnerId', req.params.id2).andWhere('id', '>', p2LastLoss.id).count({ count: '*' }).first()
                                        .then(p2Streak => {
                                            stats.player2.streak = p2Streak.count;
                                            res.status(200).json(stats);
                                        })
                                        .catch((error) => {
                                            res.status(500).json({ error });
                                        });
                                    })
                                    .catch((error) => {
                                        res.status(500).json({ error });
                                    });
                                })
                                .catch((error) => {
                                    res.status(500).json({ error });
                                });
                            })
                            .catch((error) => {
                                res.status(500).json({ error });
                            });
                        })
                        .catch((error) => {
                            res.status(500).json({ error });
                        });
                    })
                    .catch((error) => {
                        res.status(500).json({ error });
                    });
                })
                .catch((error) => {
                    res.status(500).json({ error });
                }); 
            })
            .catch((error) => {
                res.status(500).json({ error });
            });      
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
    })
    .catch((error) => {
        res.status(500).json({ error });
    });
});

module.exports = router; //makes this available in index.js