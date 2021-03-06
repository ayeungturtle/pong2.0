import React, { Component } from 'react';
import { FormControl, FormGroup, Button, Grid, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { NewPlayerModalComponent } from './components/NewPlayerModalComponent';
import { AlertComponent } from './components/AlertComponent';
import { PingKingComponent } from './components/PingKingComponent';
import { NewPlayerComponent } from './components/NewPlayerComponent';
import { RandomRobinComponent } from './components/RandomRobinComponent';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newPlayerModal: false,
            newPlayer: {
                firstName: null,
                lastName: null,
                nickName: null
            },
            alert: {
                alertType: 0,
                alertContent: null
            }
        };

        this.showNewPlayerModal = this.showNewPlayerModal.bind(this);
        this.hideNewPlayerModal = this.hideNewPlayerModal.bind(this);
        this.dismissAlert = this.dismissAlert.bind(this);
        this.getPlayers = this.getPlayers.bind(this);
        this.alertGameSaveFailure = this.alertGameSaveFailure.bind(this);
        this.addAlert = this.addAlert.bind(this);
    }

    componentDidMount() {
        this.getPlayers();
    }

    showNewPlayerModal() {
        this.setState({ newPlayerModal: true });
    }

    hideNewPlayerModal() {
        this.setState({ newPlayerModal: false });
    }

    getPlayers() {
        fetch('api/players', {
            method: 'GET'
        })
        .then(res => {
            if (res.status === 200) {
                res.json()
                .then(players => {
                    this.setState({ players: players })
                });
            }
        });
    };

    alertGameSaveFailure() {
        this.setState({ alertType: 4 });
        setTimeout(() => this.dismissAlert(), 5000);
    }

    alertAchievement(player, lutAchievementTypeId) {
        this.setState({ alertType})
    }

    addAlert(alert) {
        this.setState({ alert: alert });
        setTimeout(() => this.dismissAlert(), 5000);
    }

    dismissAlert() {
        this.setState({ alert: {alertType: 0, alertContent: null} })
    }

    render() {
        return (
            <Grid>
                <Row className="header-row">
                    <Col md={12}>
                        <Tabs defaultActiveKey={0} id="Game Mode Tabs">
                            <Tab eventKey={0} title="Ping King">
                                <PingKingComponent
                                alertGameSaveFailure={() => this.alertGameSaveFailure()}
                                />
                            </Tab>
                            <Tab eventKey={1} title="Random Robin">
                                <RandomRobinComponent
                                alertGameSaved={(success, newGame) => this.alertGameSaved(success, newGame)}                                
                                />
                            </Tab>
                            <Tab eventKey={2} title="New Player">
                                <NewPlayerComponent 
                                    newPlayerModal={this.state.newPlayerModal}
                                    hideNewPlayerModal={this.hideNewPlayerModal}
                                    addAlert={(newAlert) => this.addAlert(newAlert)}
                                />
                            </Tab>
                        </Tabs>
                    </Col>
                    {/* <Col >
                        <Row>
                            <Button bsStyle="primary" onClick={this.showNewPlayerModal}>
                                New Player
                            </Button>
                        </Row>
                    </Col> */}
                </Row>
                <NewPlayerModalComponent 
                    newPlayerModal={this.state.newPlayerModal}
                    hideNewPlayerModal={this.hideNewPlayerModal}
                    addAlert={(newAlert) => this.addAlert(newAlert)}
                />
                <div className="alert-bottom">
                    <AlertComponent
                        alert={this.state.alert}
                        dismissAlert={this.dismissAlert}
                    />
                </div>

            </Grid>
        );
    }
}


// constructor(props) {
//   super(props);
//   this.state = { 
//     username: null,
//     newUser: 'yaman',
//     test: null
//   };
// }

// componentDidMount() {
//   fetch('/api/getUsername')
//     .then(res => res.json())
//     .then(user => this.setState({ username: user.username }));
    
//   fetch('api/players', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify ({
//       firstName: "Andy",
//       lastName: "Yeung"
//     })
//   })
//   .then(res => res.json())
//   .then(userString => this.setState({ newUser: userString.string}));

//   fetch('/api/test')
//   .then( res => res.json())
//   .then( test => this.setState({ test: test.playerId1}))
// }

// render() {
//   return (
//     <Row>
//       <Col md={6}>
//         {this.state.username ? (
//           <h1>Hello {this.state.username}</h1>
//         ) : (
//           <h1>Loading.. please wait!</h1>
//         )}
//       </Col>
//       <Col md={2}>
//         <h1>{this.state.newUser}</h1>
//       </Col>
//       test: {this.state.test}
//     </Row>
//   );
// }