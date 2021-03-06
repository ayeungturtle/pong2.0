const express = require ('express');
const router = express.Router();
const db = require ('../db/knex');

router.get('/api/players', async (req, res) => {
    try {
        const allPlayers = await db('players').select().orderBy('firstName');
        res.status(200).json(allPlayers);
    }
    catch(error) {
        res.status(500).json({ error });
    }
});

router.get('/api/players/:id', async (req, res) => {
    try {
        const matchingPlayer = await db('players').where({ id: req.params.id }).select();
        if (matchingPlayer.length === 0)
            res.status(404).json({ error: "No matching player found." });
        else
            res.status(200).json(matchingPlayer); 
    }
    catch(error) {
        res.status(500).json({ error });
    }
});

router.post('/api/players', async (req, res) => {
    try {
        await db('players').insert({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nickName: req.body.nickName,
            lutRole: req.body.lutRole
        })
        res.status(201).json({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nickName: req.body.nickName,
            lut_role: req.body.lutRole            
        })
    }
    catch(error) {
        res.status(500).json({ error });
    }
});

router.get('/api/players/stats/:id1/:id2', async (req, res) => {
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

    try {
        const p1TotalWins = await db('games').where({ winnerId: req.params.id1 }).count({ count: '*' }).first();
        stats.player1.totalWins = p1TotalWins.count;
        const p2TotalWins = await db('games').where({ winnerId: req.params.id2 }).count({ count: '*' }).first();
        stats.player2.totalWins = p2TotalWins.count;
        const p1TotalLosses = await db('games').where({ loserId: req.params.id1 }).count({ count: '*' }).first();
        stats.player1.totalLosses = p1TotalLosses.count;
        const p2TotalLosses = await db('games').where({ loserId: req.params.id2 }).count({ count: '*' }).first();
        stats.player2.totalLosses = p2TotalLosses.count;
        const p1h2hWins = await db('games').where({ winnerId: req.params.id1, loserId: req.params.id2 }).count({ count: '*' }).first();
        stats.player1.h2hWins = p1h2hWins.count;
        const p2h2hWins = await db('games').where({ winnerId: req.params.id2, loserId: req.params.id1 }).count({ count: '*' }).first();
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

        const p1LastLoss = await db('games').where({ loserId: req.params.id1 }).orderBy('id', 'desc').first();
        var p1Streak;
        console.log(p1LastLoss);
        if (p1LastLoss === undefined)
            p1Streak = await db('games').where('winnerId', req.params.id1).count({ count: '*' }).first();
        else
            p1Streak = await db('games').where('winnerId', req.params.id1).andWhere('id', '>', p1LastLoss.id).count({ count: '*' }).first();
        stats.player1.streak = p1Streak.count;

        const p2LastLoss = await db('games').where({ loserId: req.params.id2 }).orderBy('id', 'desc').first();
        var p2Streak;
        if (p2LastLoss === undefined)
            p2Streak = await db('games').where('winnerId', req.params.id2).count({ count: '*' }).first();
        else
            p2Streak = await db('games').where('winnerId', req.params.id2).andWhere('id', '>', p2LastLoss.id).count({ count: '*' }).first();
        stats.player2.streak = p2Streak.count;

        res.status(200).json(stats);
    }
    catch(error) {
        res.status(500).json({ error });
    }
});

module.exports = router; //makes this available in index.js