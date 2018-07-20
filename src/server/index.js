const express = require('express');
const os = require('os');
const bodyParser = require('body-parser');
var mysql = require('mysql');

const app = express();

const players = require('./routes/players');
const games = require('./routes/games');
app.use(players);  //this mounts the players router, all the route defined there are available to appjjjj
app.use(games);

app.use(express.static('dist'));
app.use(bodyParser.json());

const db = require('./db/knex');

app.listen(8080, () => console.log('Listening on port 8080!'));
