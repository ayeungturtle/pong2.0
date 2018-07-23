import React, { Component } from 'react';
import { Alert, Modal, Button, Glyphicon, FormGroup, Select, Row, FormControl, DropdownButton, MenuItem, Col, ControlLabel, ListGroup, ListGroupItem } from 'react-bootstrap';

export class RandomRobinComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        
        this.state = {
            activePlayers: [],
            inactivePlayers: [],
            selectedPlayer: null,
            player1: null,
            player2: null,
            player1Score: 0,
            player2Score: 0,
            stats: {
                player1: {
                    totalWins: null,
                    totalLosses: null,
                    h2hWins: null,
                    winProbability: null
                },
                player2: {
                    totalWins: null,
                    totalLosses: null,
                    h2hWins: null,
                    winProbability: null
                }
            },
            recentGames: [],
            currentRound: [],
            nextRound: []
        };
        
        this.getPlayers = this.getPlayers.bind(this);
        this.activatePlayer = this.activatePlayer.bind(this);
        this.deactivatePlayer = this.deactivatePlayer.bind(this);
        this.incrementScore = this.incrementScore.bind(this);
        this.decrementScore = this.decrementScore.bind(this);
        this.submitGame = this.submitGame.bind(this);
        this.queueGame = this.queueGame.bind(this);
        this.addRecentGame = this.addRecentGame.bind(this);
        this.formatPercent = this.formatPercent.bind(this);
        this.createNewRound = this.createNewRound.bind(this);
    }

    componentDidMount() {
        this.getPlayers();
    }

    getPlayers() {
        fetch('api/players', {
            method: 'GET'
        })
        .then(res => {
            if (res.status === 200) {
                res.json()
                .then(players => {
                    this.setState({ inactivePlayers: players })
                });
            }
        });
    };

    activatePlayer(selectedPlayer) {
        if (selectedPlayer != null) {
            const tempInactivePlayers = this.state.inactivePlayers;
            this.state.inactivePlayers.forEach((player, index) => {
                if (player.id === selectedPlayer.id)
                    tempInactivePlayers.splice(index, 1);
            });          
            this.setState((prevState) => ({ 
                    activePlayers: prevState.activePlayers.concat(selectedPlayer), 
                    inactivePlayers: tempInactivePlayers 
            }));
        }
    }

    deactivatePlayer(removePlayer) {
        var tempInactivePlayers = this.state.inactivePlayers;
        var tempActivePlayers = this.state.activePlayers;
        var nextInactivePlayerString;
        var previousInactivePlayerString;
        var removePlayerString;
        if (removePlayer != null) {
            this.state.activePlayers.forEach((activePlayer, index) => {
                if (activePlayer.id === removePlayer.id)
                    tempActivePlayers.splice(index, 1);
            });
            for (var i = 0; i < this.state.inactivePlayers.length; i++) {
                nextInactivePlayerString = this.formatPlayerName(this.state.inactivePlayers[i]).toLowerCase();
                removePlayerString = this.formatPlayerName(removePlayer).toLowerCase();
                if (i === 0) {
                    if (removePlayerString < nextInactivePlayerString) {
                        tempInactivePlayers.unshift(removePlayer);
                        break;
                    }
                } else {
                    previousInactivePlayerString = this.formatPlayerName(this.state.inactivePlayers[i-1]).toLowerCase();
                    if (removePlayerString > previousInactivePlayerString && removePlayerString < nextInactivePlayerString){
                        tempInactivePlayers = tempInactivePlayers.slice(0, i).concat(removePlayer, tempInactivePlayers.slice(i));
                        break;
                    }
                    else if (i === this.state.inactivePlayers.length - 1)
                        tempInactivePlayers = tempInactivePlayers.concat(removePlayer);
                }   
            }
        }
        this.setState({ inactivePlayers: tempInactivePlayers, activePlayers: tempActivePlayers })
    }

    incrementScore(player) {
        switch(player) {
            case "player1":
                this.setState({ player1Score: this.state.player1Score + 1 });
                break;
            case "player2":
                this.setState({ player2Score: this.state.player2Score + 1 });
                break;
            default:
                break;
        }
    }

    decrementScore(player) {
        switch(player) {
            case "player1":
                this.setState({ player1Score: this.state.player1Score - 1 });
                break;
            case "player2":
                this.setState({ player2Score: this.state.player2Score - 1 });
                break;
            default:
                break;
        }
    }

    formatPlayerName(player) {
        return (player.firstName + " " + player.lastName);
    }

    submitGame() {
        if (this.state.player1 == null || this.state.player2 == null)
            return;
        const player1 = this.state.player1;
        const player2 = this.state.player2;
        const player1Score = this.state.player1Score;
        const player2Score = this.state.player2Score;
        var winnerId;
        var loserId;
        var winnerScore;
        var loserScore;
        if (player1Score > player2Score) {
            winnerId = player1.id;
            loserId = player2.id;
            winnerScore = player1Score;
            loserScore = player2Score;
        }
        else if (player2Score > player1Score) {
            winnerId = player2.id;
            loserId = player1.id;
            winnerScore = player2Score;
            loserScore = player1Score;
        }
        else {
            alert("There are no ties in ping pong, you fool.");
            return;
        }
        var newGame = {
            winnerId,
            loserId,
            winnerScore,
            loserScore,
            gameMode: 2,
        };
        confirm(this.formatPlayerName(player2) + " " + player2Score + " - " + player1Score + " " + this.formatPlayerName(player1) )
        fetch('api/games', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify (newGame)
        })
        .then(res => {
            if (res.status === 201) {
                res.json()
                .then(() => {
                    var gameResult;
                    var player2Result = this.formatPlayerName(player2) + " " + player2Score;
                    var player1Result = player1Score + " " + this.formatPlayerName(player1);
                    var winner;
                    if (winnerId === player1.id)
                        winner = 1;
                    if (winnerId === player2.id)
                        winner = 2;
                    this.props.alertGameSaved(true, {winner: winner, player1Result: player1Result, player2Result: player2Result});
                    this.addRecentGame({winner: winner, player1Result: player1Result, player2Result: player2Result});
                    this.queueGame();  
                });
            }
            else {
                this.props.alertGameSaved(false, null);              
            }
        })
    }

    queueGame() {
        this.setState({player1Score: 0, player2Score: 0});
        if (this.state.currentRound.length === 0) {
            var currentRoundTemp = [...this.state.nextRound];
            this.setState({
                player1: currentRoundTemp[0].player1,
                player2: currentRoundTemp[0].player2,
                currentRound: currentRoundTemp.slice(1),
                nextRound: this.createNewRound(this.state.activePlayers)
            }, () => {
                this.getStats();
            });
        } else {
            this.setState((prevState) => ({
                player1: prevState.currentRound[0].player1,
                player2: prevState.currentRound[0].player2,
                currentRound: prevState.currentRound.slice(1)
            }), () => {
                this.getStats();
            });
        }
    }
  
    getStats() {
        if (this.state.player1 === null || this.state.player2 === null || this.state.player1 == this.state.player2)
            return;
        const fetchUrl = 'api/players/stats/' + this.state.player1.id + '/' + this.state.player2.id;
        fetch(fetchUrl, {
            method: 'GET'
        })
        .then(res => {
            if (res.status === 200) {
                res.json()
                .then(stats => {
                    this.setState({ stats: stats })
                });
            }
        })
        .catch((error) => {
            console.log( error )
        });
    }

    addRecentGame(newGame) {
        this.setState({ recentGames: [newGame].concat(this.state.recentGames) });
    }

    formatPercent(decimal) {
        const percent = Math.round(decimal * 100).toString();
        return (percent + "%");
    }

    formatMatchName(match) {
        var string = match.player2.firstName + " - " + match.player1.firstName;
        return string;
    }

    createNewRound(players) {
        if (players == null || players.length < 2)
            return [];
        var playersArray = [...players];
        var matchesArray = [];
        var randomIndex;
        var player1;
        var player2;
        for (var i = players.length; i > 0; i--) {
            randomIndex = Math.round(Math.random() * 1000) % i;
            player1 = playersArray[randomIndex];
            playersArray.splice(randomIndex, 1);
            i--;
            if (i === 0) {   // if no one is left to match up with player1
                randomIndex = Math.round(Math.random() * 1000) % players.length;
                while (players[randomIndex] == player1)
                    randomIndex = Math.round(Math.random() * 1000) % players.length;
                player2 = players[randomIndex];
            } else {
                randomIndex = Math.round(Math.random() * 1000) % i;
                player2 = playersArray[randomIndex];
                playersArray.splice(randomIndex, 1);                
            }
            matchesArray.push({player1, player2});
        }
        return matchesArray;
    }

    handleRoundButton() {
        var currentRound = this.createNewRound(this.state.activePlayers);
        this.setState({
            player1: currentRound[0].player1,
            player2: currentRound[0].player2,
            currentRound: currentRound.slice(1),
            nextRound: this.createNewRound(this.state.activePlayers)
        }, () => {
            this.getStats();            
        });
    }

    render() {
        return (
            <Row>
                <Row className="white-divider"/>
                <Col md={3} sm={3} >
                    <Row>
                        <DropdownButton  bsStyle="warning" id="Add Player" title="Players" onSelect={(event) => this.activatePlayer(event)}>
                            {
                                this.state.inactivePlayers.map((player, index) => {
                                    return(
                                        <MenuItem eventKey={player} key={index}>{this.formatPlayerName(player)}</MenuItem>
                                    )
                                })
                            }
                        </DropdownButton>
                        <Button className="button-round-generate" bsStyle="warning" onClick={() => this.handleRoundButton()}>
                            Round +
                        </Button>
                    </Row>
                    <br/>
                    {
                        this.state.activePlayers.length > 0 && 
                        <Row>
                            <div className="title-round">Active Players:</div>
                            <ListGroup>
                                {
                                    this.state.activePlayers.map((player, index) => {
                                        return(
                                            <ListGroupItem key={index} value={player} className="active-players">
                                                {this.formatPlayerName(player)}
                                                <button className="pull-right button-x" onClick={() => this.deactivatePlayer(player)}>X</button>
                                            </ListGroupItem>
                                        )
                                    })
                                }                 
                            </ListGroup>
                        </Row>
                    }
                    <br/>
                    <Row>
                        <Col md={6} sm={6}>
                            {
                                this.state.currentRound.length > 0 &&
                                <Row>
                                    <div className="title-round">Current Round:</div>
                                    <ListGroup>
                                        {
                                            this.state.currentRound.map((match, index) => {
                                                return(
                                                    <ListGroupItem key={index} value={match} className="round-queue">
                                                        {this.formatMatchName(match)}
                                                    </ListGroupItem>
                                                )
                                            })
                                        }                 
                                    </ListGroup>
                                </Row>
                            }
                        </Col>
                        <Col md={6} sm={6}>
                            {
                                this.state.nextRound.length > 0 &&
                                    <Row>
                                        <div className="title-round">Next Round:</div>
                                        <ListGroup>
                                            {
                                                this.state.nextRound.map((match, index) => {
                                                    return(
                                                        <ListGroupItem key={index} value={match} className="round-queue">
                                                            {this.formatMatchName(match)}
                                                        </ListGroupItem>
                                                    )
                                                })
                                            }                 
                                        </ListGroup>
                                    </Row>
                            }
                        </Col>
                    </Row>
                </Col>
                <Col md={6} sm={6}>
                    <Row>
                        <Col md={6} sm={6} className="player player2">
                            <Row >
                                <button className="pull-left pull-up dismiss-player-button" onClick={() => this.queueLoser(this.state.player2.id)}></button>
                                <div onClick={() => this.incrementScore("player2")} className="score-number"> {this.state.player2Score} </div>
                                <button onClick={() => this.decrementScore("player2")} className="score-decrementer"></button>
                                { this.state.player2 !== null && this.state.player2 !== "" &&
                                    <div className>
                                        {this.formatPlayerName(this.state.player2)}
                                    </div>
                                }
                                { this.state.player2 !== null && this.state.player2.nickName !== null &&
                                    <div>
                                        {'"' + this.state.player2.nickName + '"'}
                                    </div>
                                }
                            </Row>
                        </Col>
                        <Col md={6} sm={6} className="player player1">
                            <Row>
                                <button className="pull-right pull-up dismiss-player-button" onClick={() => this.queueLoser(this.state.player1.id)}></button>
                                <div onClick={() => this.incrementScore("player1")} className="score-number"> {this.state.player1Score} </div>
                                <button onClick={() => this.decrementScore("player1")} className="score-decrementer"></button>
                                { this.state.player1 !== null && this.state.player1 !== "" &&
                                    <div>
                                        {this.formatPlayerName(this.state.player1)}
                                    </div>
                                }
                                { this.state.player1 !== null && this.state.player1.nickName !== null &&
                                    <div>
                                        {'"' + this.state.player1.nickName + '"'}
                                    </div>
                                }
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4} sm={4} className="playerStats playerStats2">
                            <Row className="player-stats-row">
                                {
                                    this.state.stats.player2.totalWins !== null && this.state.stats.player2.totalLosses !== null &&
                                        <span className="playerStatsContent">{this.state.stats.player2.totalWins + " - " + this.state.stats.player2.totalLosses}</span>
                                }
                            </Row>
                            <Row className="player-stats-row">
                                {
                                    this.state.stats.player2.h2hWins !== null &&
                                        <span className="playerStatsContent">{this.state.stats.player2.h2hWins}</span>
                                }
                            </Row>
                            <Row className="player-stats-row">
                                {
                                    this.state.stats.player2.winProbability !== null &&
                                        <span className="playerStatsContent">{this.formatPercent(this.state.stats.player2.winProbability)}</span>
                                }
                            </Row>
                            <Row className="player-stats-row">
                                
                            </Row>
                        </Col>
                        <Col md={4} sm={4} className="playerStats playerStatsCenter">
                            <Row className="player-stats-row">
                                Overall Record
                            </Row>
                            <Row className="player-stats-row">
                                H2H Wins
                            </Row>
                            <Row className="player-stats-row">
                                Win Probability
                            </Row>
                            <Row className="player-stats-row">
                                Streak
                            </Row>
                        </Col>
                        <Col md={4} sm={4} className="playerStats playerStats1">
                            <Row className="player-stats-row">
                                {
                                    this.state.stats.player1.totalWins !== null && this.state.stats.player1.totalLosses !== null &&
                                        <span>{this.state.stats.player1.totalWins + " - " + this.state.stats.player1.totalLosses}</span>
                                }
                            </Row>
                            <Row className="player-stats-row">
                                {
                                    this.state.stats.player1.h2hWins !== null &&
                                        <span>{this.state.stats.player1.h2hWins}</span>
                                }
                            </Row>
                            <Row className="player-stats-row">
                                {
                                    this.state.stats.player1.winProbability !== null &&
                                        <span>{this.formatPercent(this.state.stats.player1.winProbability)}</span>
                                }
                            </Row>
                            <Row className="player-stats-row">
                                
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col md={3} sm={3}>
                    <Row>
                        <Button className="pull-right" bsStyle="success" onClick={this.submitGame}>
                            Submit
                        </Button>  
                    </Row>
                    <Row className="white-divider"/>
                    <Row>
                        <ListGroup>
                            {
                                this.state.recentGames.map((game, index) => {
                                    return(
                                        <ListGroupItem key={index} value={game} className="recent-games">
                                            {
                                                game.winner === 1 ?
                                                    <span>
                                                        <span>{ game.player2Result + " - "}</span>
                                                        <b>{ game.player1Result }</b>
                                                    </span>
                                                :
                                                    <span>
                                                        <b>{ game.player2Result }</b>
                                                        <span>{ " - " + game.player1Result }</span>
                                                    </span>
                                            }
                                        </ListGroupItem>
                                    )
                                })
                            }                 
                        </ListGroup>
                    </Row>
                </Col>
            </Row>
        )
    }
}