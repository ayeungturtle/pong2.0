import React, { Component } from 'react';
import { Alert, Modal, Button, FormGroup, FormControl, Col, ControlLabel, Row } from 'react-bootstrap';

export class AlertComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        
        this.state = {
            alertTypes: {
                noAlert: 0,
                newPlayerSaveSuccess: 1,
                newPlayerSaveFailure: 2,
                gameSaveSuccess: 3,
                gameSaveFailure: 4,
            }
        };
    }
  
    render() {
        switch(this.props.alertType) {
            case this.state.alertTypes.newPlayerSaveSuccess:
                return (
                    <Alert bsStyle="success" className="alert-bottom" onDismiss={this.props.dismissAlert}>
                        {"New player saved: " + this.props.newPlayer.firstName + " " + this.props.newPlayer.lastName}
                    </Alert>
                );
                break;
            case this.state.alertTypes.newPlayerSaveFailure:
                return (
                    <Alert bsStyle="danger" className="pull-down" onDismiss={this.props.dismissAlert}>
                       New player failed to save.
                    </Alert>
                );
                break;
            case this.state.alertTypes.gameSaveSuccess:
                return (
                    <Alert bsStyle="success" onDismiss={this.props.dismissAlert}>
                        {
                            this.props.lastGameSaved.winner === 1 ?
                                <span>
                                    <span>{ "Game saved: " + this.props.lastGameSaved.player2Result + " - "}</span>
                                    <b>{ this.props.lastGameSaved.player1Result }</b>
                                </span>
                            :
                                <span>
                                    <span>{ "Game saved: " }</span>
                                    <b>{ this.props.lastGameSaved.player2Result }</b>
                                    <span>{ " - " + this.props.lastGameSaved.player1Result }</span>
                                </span>
                        }
                    </Alert>
                );
                break;
            case this.state.alertTypes.gameSaveFailure:
                return (
                    <Alert bsStyle="danger" className="alert-bottom" onDismiss={this.props.dismissAlert}>
                       Game failed to save.
                    </Alert>
                );
                break;
            case 100:
                return (
                    <Alert bsStyle="info" onDismiss={this.props.dismissAlert}>
                       fafgaasgagasdg.
                    </Alert>
                );
                break;
            default:
                return null;
        }
    }
}
