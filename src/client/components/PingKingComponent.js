import React, { Component } from 'react';
import { Alert, Modal, Button, Glyphicon, FormGroup, Select, Row, FormControl, DropdownButton, MenuItem, Col, ControlLabel, ListGroup, ListGroupItem } from 'react-bootstrap';

export class PingKingComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        
        this.state = {
            playerQueue: [],
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
            recentGames: []
        };
        
        this.getPlayers = this.getPlayers.bind(this);
        this.enqueuePlayer = this.enqueuePlayer.bind(this);
        this.removeFromQueue = this.removeFromQueue.bind(this);
        this.incrementScore = this.incrementScore.bind(this);
        this.decrementScore = this.decrementScore.bind(this);
        this.submitGame = this.submitGame.bind(this);
        this.queueLoser = this.queueLoser.bind(this);
        this.addRecentGame = this.addRecentGame.bind(this);
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

    enqueuePlayer(selectedPlayer) {
        if (selectedPlayer != null) {
            const tempInactivePlayers = this.state.inactivePlayers;
            this.state.inactivePlayers.forEach((player, index) => {
                if (player.id === selectedPlayer.id)
                    tempInactivePlayers.splice(index, 1);
            });
            if (this.state.player1 == null) {
                this.setState({ inactivePlayers: tempInactivePlayers, player1: selectedPlayer });
            } 
            else if (this.state.player2 == null) {
                this.setState({ inactivePlayers: tempInactivePlayers, player2: selectedPlayer }, () => {
                    this.getStats();
                });
            }
            else {
                this.setState({ playerQueue: [...this.state.playerQueue, selectedPlayer], inactivePlayers: tempInactivePlayers });
            }
        }
    }

    removeFromQueue(removePlayer) {
        var tempInactivePlayers = this.state.inactivePlayers;
        var tempPlayerQueue = this.state.playerQueue;
        var nextInactivePlayerString;
        var previousInactivePlayerString;
        var removePlayerString;
        if (removePlayer != null) {
            if (removePlayer.id === this.state.player1.id) {
                this.enqueuePlayer(this.state.player1);
                this.setState({ player1: this.state.player2, player2: this.state.playerQueue[0], playerQueue: this.state.playerQueue.slice(1) }, () => {
                    this.getStats();
                });
                return;
            }
            else if (removePlayer.id === this.state.player2.id) {
                this.enqueuePlayer(this.state.player2);
                this.setState({ player2: this.state.playerQueue[0], playerQueue: this.state.playerQueue.slice(1) }, () => {
                    this.getStats();                
                });
                return;
            }
            else {
                this.state.playerQueue.forEach((queuedPlayer, index) => {
                    if (queuedPlayer.id === removePlayer.id) {
                        tempPlayerQueue.splice(index, 1);
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
                });
            }
        }
        this.setState({ inactivePlayers: tempInactivePlayers, playerQueue: tempPlayerQueue })
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
            isTournamentGame: 0
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
                    this.queueLoser(loserId);  
                });
            }
            else {
                this.props.alertGameSaved(false, null);              
            }
        })
    }

    queueLoser(loserId) {
        if (loserId === this.state.player2.id) {
            this.removeFromQueue(this.state.player2);
            this.setState({
                player1Score: 0,
                player2Score: 0,
            })
        }
        else if (loserId === this.state.player1.id) {
            this.removeFromQueue(this.state.player1);   
            this.setState({
                player1Score: 0,
                player2Score: 0,
            })
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

    render() {
        return (
            <Row>
                <Col md={3} sm={3}>
                    <Row>
                        {/* <Select>
                            name="addPlayer"
                            placeholder="Add Player"
                            searchable={true}
                            clearable={true}
                            onChange={this.enqueuePlayer}
                            options={this.props.players.map(player => {
                                return {...player, value: player.id, label: player.FirstName + " " + player.LastName };
                                }
                            )}
                        </Select> */}
                        <Col md={8} sm={8}>
                            <DropdownButton id="Add Player" title="Add Player" onSelect={(event) => this.enqueuePlayer(event)}>
                                {
                                    this.state.inactivePlayers.map((player, index) => {
                                        return(
                                            <MenuItem eventKey={player} key={index}>{this.formatPlayerName(player)}</MenuItem>
                                        )
                                    })
                                }
                            </DropdownButton>
                            {/* <FormGroup controlId="addPlayer">
                                <ControlLabel>Add Player</ControlLabel>
                                <FormControl
                                    onChange={on()this.selectPlayer()} 
                                    componentClass="select" 
                                    placeholder="select player..."
                                    id="addPlayer"
                                >
                                    {
                                        this.state.inactivePlayers.map((player, index) => {
                                            return(
                                                <option 
                                                    onClick={() => this.selectPlayer(player)} 
                                                    key={index} 
                                                    value={player}>{this.formatPlayerName(player)}
                                                </option>
                                            )
                                        })
                                    }
                                </FormControl>
                            </FormGroup> */}
                        </Col>
                        {/* <Col md={4} sm={4}>
                            <button onClick={this.enqueuePlayer}>+</button>
                        </Col> */}
                    </Row>
                    <Row>
                        <ListGroup>
                            {
                                this.state.playerQueue.map((player, index) => {
                                    return(
                                        <ListGroupItem key={index} value={player}>
                                            {this.formatPlayerName(player)}
                                            <button className="pull-right" onClick={() => this.removeFromQueue(player)}>-</button>
                                        </ListGroupItem>
                                    )
                                })
                            }                 
                        </ListGroup>
                    </Row>
                </Col>
                <Col md={3} sm={3} className="text-center">
                    <Row >
                        <h1 onClick={() => this.incrementScore("player2")} > {this.state.player2Score} </h1>
                        <button onClick={() => this.decrementScore("player2")}>-</button>
                    </Row>
                    { this.state.player2 !== null && this.state.player2 !== "" &&
                        <h1>
                            {this.formatPlayerName(this.state.player2)}
                        </h1>
                    }
                </Col>
                <Col md={3} sm={3} className="text-center">
                    <Row>
                        <h1 onClick={() => this.incrementScore("player1")} > {this.state.player1Score} </h1>
                        <button onClick={() => this.decrementScore("player1")}>-</button>
                    </Row>
                    { this.state.player1 !== null && this.state.player1 !== "" &&
                        <h1>
                            {this.formatPlayerName(this.state.player1)}
                        </h1>
                    }
                </Col>
                <Col md={3} sm={3}>
                    <Row>
                        <Button className="pull-right" bsStyle="success" onClick={this.submitGame}>
                            SUBMIT
                        </Button>  
                    </Row> 
                    <Row>
                        <ListGroup>
                            {
                                this.state.recentGames.map((game, index) => {
                                    return(
                                        <ListGroupItem key={index} value={game}>
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